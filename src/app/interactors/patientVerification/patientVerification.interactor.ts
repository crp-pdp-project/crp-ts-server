import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { PatientVerificationBodyDTO } from 'src/app/entities/dtos/input/patientVerification.input.dto';
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
import { SavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { UpsertDeviceRepository } from 'src/app/repositories/database/upsertDevice.respository';
import {
  IUpsertSessionRepository,
  UpsertSessionRepository,
} from 'src/app/repositories/database/upsertSession.respository';
import { ConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { IJWTManager, JWTManagerBuilder } from 'src/general/managers/jwt/jwt.manager';

import { PatientVerificationEnrollStrategy } from './strategies/patientVerificationEnroll.strategy';
import { PatientVerificationRecoverStrategy } from './strategies/patientVerificationRecover.strategy';

export interface IPatientVerificationStrategy {
  generateSession(patientExternalModel: PatientExternalModel, device: DeviceModel): Promise<SessionPayloadDTO>;
}

export interface IPatientVerificationInteractor {
  verify(body: PatientVerificationBodyDTO, device: DeviceModel): Promise<PatientExternalSessionModel>;
}

export class PatientVerificationInteractor implements IPatientVerificationInteractor {
  constructor(
    private readonly flowIdentifier: AuthFlowIdentifier,
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly saveSessionRepository: IUpsertSessionRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
    private readonly verificationStrategy: IPatientVerificationStrategy,
  ) {}

  async verify(body: PatientVerificationBodyDTO, device: DeviceModel): Promise<PatientExternalSessionModel> {
    const attemptModel = await this.fetchAttempt(body.documentNumber);
    attemptModel.validateAttempt();
    const externalPatientModel = await this.searchPatient(body);
    externalPatientModel.validatePatient();
    const sessionPayload = await this.verificationStrategy.generateSession(externalPatientModel, device);
    const sessionModel = await this.generateJwtToken(sessionPayload, externalPatientModel);
    await this.persistSession(sessionModel);

    return sessionModel;
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.flowIdentifier);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, this.flowIdentifier);
    return attemptModel;
  }

  private async searchPatient(body: PatientVerificationBodyDTO): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute(body);
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async generateJwtToken(
    sessionPayload: SessionPayloadDTO,
    patientExternalModel: PatientExternalModel,
  ): Promise<PatientExternalSessionModel> {
    const token = await this.jwtManager.generateToken(sessionPayload);
    const externalSessionModel = new PatientExternalSessionModel(patientExternalModel, token);

    return externalSessionModel;
  }

  private async persistSession(sessionModel: PatientExternalSessionModel): Promise<void> {
    await this.saveSessionRepository.execute(sessionModel.toPersisSessionPayload());
  }
}

export class PatientVerificationInteractorBuilder {
  static buildEnroll(): PatientVerificationInteractor {
    return new PatientVerificationInteractor(
      AuthFlowIdentifier.ENROLL,
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new GetAuthAttemptsRepository(),
      new UpsertSessionRepository(),
      JWTManagerBuilder.buildEnrollConfig<SessionPayloadDTO>(),
      new PatientVerificationEnrollStrategy(
        new ConfirmPatientRepository(),
        new SavePatientRepository(),
        new UpsertDeviceRepository(),
      ),
    );
  }

  static buildRecover(): PatientVerificationInteractor {
    return new PatientVerificationInteractor(
      AuthFlowIdentifier.RECOVER,
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new GetAuthAttemptsRepository(),
      new UpsertSessionRepository(),
      JWTManagerBuilder.buildRecoverConfig<SessionPayloadDTO>(),
      new PatientVerificationRecoverStrategy(new UpsertDeviceRepository()),
    );
  }
}
