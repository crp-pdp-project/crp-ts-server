import type { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { CreatePatientBodyDTO } from 'src/app/entities/dtos/input/createPatient.input.dto';
import type { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { PatientExternalTokenModel } from 'src/app/entities/models/patient/patientExternalToken.model';
import type { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import type { IGetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { GetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import type { IUpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import { UpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import type { IUpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import { UpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import type { IUpsertSessionRepository } from 'src/app/repositories/database/upsertSession.respository';
import { UpsertSessionRepository } from 'src/app/repositories/database/upsertSession.respository';
import type { IConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import type { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import type { IJWTManager } from 'src/general/managers/jwt/jwt.manager';
import { JWTManagerBuilder } from 'src/general/managers/jwt/jwt.manager';

export interface ICreatePatientInteractor {
  create(body: CreatePatientBodyDTO, device: DeviceModel): Promise<PatientExternalTokenModel>;
}

export class CreatePatientInteractor implements ICreatePatientInteractor {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly upsertPatientRepository: IUpsertPatientRepository,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly saveSessionRepository: IUpsertSessionRepository,
    private readonly upsertDevice: IUpsertDeviceRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async create(body: CreatePatientBodyDTO, device: DeviceModel): Promise<PatientExternalTokenModel> {
    const attemptModel = await this.fetchAttempt(body.documentNumber);
    attemptModel.validateAttempt();
    const newFmpId = await this.patientCreation(body);
    const patientExternalModel = await this.searchPatient(newFmpId, body.documentNumber);
    patientExternalModel.validatePatient();
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
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const existingAccount = await this.getPatientAccountRepository.execute(documentNumber);
    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    const { insertId } = await this.upsertPatientRepository.execute(patientExternalModel.toPersistPatientPayload());
    patientExternalModel.inyectPatientId(Number(insertId));
  }

  private async generateJwtToken(patientExternalModel: PatientExternalModel): Promise<PatientExternalTokenModel> {
    const token = await this.jwtManager.generateToken(patientExternalModel.toEnrollSession());
    const externalSessionModel = new PatientExternalTokenModel(patientExternalModel, token);

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

  private async persistSession(sessionModel: PatientExternalTokenModel): Promise<void> {
    await this.saveSessionRepository.execute(sessionModel.toPersisSessionPayload());
  }
}

export class CreatePatientInteractorBuilder {
  static build(): CreatePatientInteractor {
    return new CreatePatientInteractor(
      new ConfirmPatientRepository(),
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new UpsertPatientRepository(),
      new GetAuthAttemptsRepository(),
      new UpsertSessionRepository(),
      new UpsertDeviceRepository(),
      JWTManagerBuilder.buildEnrollConfig<SessionPayloadDTO>(),
    );
  }
}
