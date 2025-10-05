import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { CreatePatientBodyDTO } from 'src/app/entities/dtos/input/createPatient.input.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { PatientExternalSessionModel } from 'src/app/entities/models/patient/patientExternalSession.model';
import {
  GetAuthAttemptsRepository,
  IGetAuthAttemptsRepository,
} from 'src/app/repositories/database/getAuthAttempts.repository';
import {
  GetPatientAccountRepository,
  IGetPatientAccountRepository,
} from 'src/app/repositories/database/getPatientAccount.repository';
import { ISavePatientRepository, SavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import {
  IUpsertDeviceRepository,
  UpsertDeviceRepository,
} from 'src/app/repositories/database/upsertDevice.respository';
import {
  IUpsertSessionRepository,
  UpsertSessionRepository,
} from 'src/app/repositories/database/upsertSession.respository';
import {
  ConfirmPatientRepository,
  IConfirmPatientRepository,
} from 'src/app/repositories/soap/confirmPatient.repository';
import {
  CreatePatientNHCRepository,
  ICreatePatientNHCRepository,
} from 'src/app/repositories/soap/createPatientNHC.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { IJWTManager, JWTManagerBuilder } from 'src/general/managers/jwt/jwt.manager';

export interface ICreatePatientInteractor {
  create(body: CreatePatientBodyDTO, device: DeviceModel): Promise<PatientExternalSessionModel>;
}

export class CreatePatientInteractor implements ICreatePatientInteractor {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly createPatientNHC: ICreatePatientNHCRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly saveSessionRepository: IUpsertSessionRepository,
    private readonly upsertDevice: IUpsertDeviceRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async create(body: CreatePatientBodyDTO, device: DeviceModel): Promise<PatientExternalSessionModel> {
    const attemptModel = await this.fetchAttempt(body.documentNumber);
    attemptModel.validateAttempt();
    const newFmpId = await this.patientCreation(body);
    const patientExternalModel = await this.searchPatient(newFmpId, body.documentType, body.documentNumber);
    patientExternalModel.validatePatient();
    await this.validateNHCId(patientExternalModel);
    await this.persistPatient(patientExternalModel);
    await this.registerDevice(patientExternalModel, device);
    const sessionModel = await this.generateJwtToken(patientExternalModel);
    await this.persistSession(sessionModel);

    return sessionModel;
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, AuthFlowIdentifier.ENROLL);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, AuthFlowIdentifier.ENROLL);
    return attemptModel;
  }

  private async patientCreation(body: CreatePatientBodyDTO): Promise<PatientDM['fmpId']> {
    const creationResult = await this.confirmPatientRepository.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      secondLastName: body.secondLastName ?? null,
      birthDate: body.birthDate,
      gender: body.gender,
      documentNumber: body.documentNumber,
      documentType: body.documentType,
      email: body.email,
      phone: body.phone,
    });

    return creationResult.fmpId;
  }

  private async searchPatient(
    fmpId: PatientDM['fmpId'],
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const existingAccount = await this.getPatientAccountRepository.execute(documentType, documentNumber);
    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async validateNHCId(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.nhcId) {
      await this.createPatientNHC.execute(patientExternalModel.fmpId!);
      const updatedSearchResult = await this.searchPatientRepository.execute({ fmpId: patientExternalModel.fmpId });
      patientExternalModel.updateModel(updatedSearchResult).validateCenter();
    }
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.hasPersistedPatient()) {
      const { insertId } = await this.savePatientRepository.execute(patientExternalModel.toPersistPatientPayload());
      patientExternalModel.inyectPatientId(Number(insertId));
    }
  }

  private async generateJwtToken(patientExternalModel: PatientExternalModel): Promise<PatientExternalSessionModel> {
    const token = await this.jwtManager.generateToken(patientExternalModel.toEnrollSession());
    const externalSessionModel = new PatientExternalSessionModel(patientExternalModel, token);

    return externalSessionModel;
  }

  private async registerDevice(patient: PatientExternalModel, device: DeviceModel): Promise<void> {
    const { insertId } = await this.upsertDevice.execute({
      patientId: patient.id!,
      os: device.os,
      identifier: device.identifier,
      name: device.name,
      expiresAt: device.expiresAt,
    });

    patient.inyectNewDevice(Number(insertId));
  }

  private async persistSession(sessionModel: PatientExternalSessionModel): Promise<void> {
    await this.saveSessionRepository.execute(sessionModel.toPersisSessionPayload());
  }
}

export class CreatePatientInteractorBuilder {
  static build(): CreatePatientInteractor {
    return new CreatePatientInteractor(
      new ConfirmPatientRepository(),
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new CreatePatientNHCRepository(),
      new SavePatientRepository(),
      new GetAuthAttemptsRepository(),
      new UpsertSessionRepository(),
      new UpsertDeviceRepository(),
      JWTManagerBuilder.buildEnrollConfig<SessionPayloadDTO>(),
    );
  }
}
