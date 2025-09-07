import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { SignInPatientBodyDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { PatientSessionModel } from 'src/app/entities/models/patient/patientSession.model';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import {
  CleanUnusedDevicesRepository,
  ICleanUnusedDevicesRepository,
} from 'src/app/repositories/database/cleanUnusedDevices.repository';
import {
  GetAuthAttemptsRepository,
  IGetAuthAttemptsRepository,
} from 'src/app/repositories/database/getAuthAttempts.repository';
import { SignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { SignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import {
  IUpsertDeviceRepository,
  UpsertDeviceRepository,
} from 'src/app/repositories/database/upsertDevice.respository';
import {
  IUpsertSessionRepository,
  UpsertSessionRepository,
} from 'src/app/repositories/database/upsertSession.respository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { EncryptionManagerBuilder } from 'src/general/managers/encryption/encryption.manager';
import { IJWTManager, JWTManagerBuilder } from 'src/general/managers/jwt/jwt.manager';

import { SignInBiometricStrategy } from './strategies/signInBiometric.strategy';
import { SignInRegularStrategy } from './strategies/signInRegular.strategy';

export interface ISignInStrategy {
  verifySignIn(body: SignInPatientBodyDTO, authAttempt: AuthAttemptModel, device: DeviceModel): Promise<PatientModel>;
}

export interface ISignInPatientInteractor {
  signIn(body: SignInPatientBodyDTO, device: DeviceModel): Promise<PatientSessionModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  private readonly flowIdentifier: AuthFlowIdentifier = AuthFlowIdentifier.SIGN_IN;

  constructor(
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly signInStrategy: ISignInStrategy,
    private readonly cleanUnusedDevices: ICleanUnusedDevicesRepository,
    private readonly saveSessionRepository: IUpsertSessionRepository,
    private readonly upsertDevice: IUpsertDeviceRepository,
    private readonly jwtManager: IJWTManager<SessionPayloadDTO>,
  ) {}

  async signIn(body: SignInPatientBodyDTO, device: DeviceModel): Promise<PatientSessionModel> {
    const attemptModel = await this.fetchAttempt(body.documentNumber);
    attemptModel.validateAttempt();
    const patient = await this.signInStrategy.verifySignIn(body, attemptModel, device);
    await this.registerDevice(patient, device);
    await this.refreshDevices(patient);
    const sessionModel = await this.generateJwtToken(patient);
    await this.persistSession(sessionModel);

    return sessionModel;
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.flowIdentifier);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, this.flowIdentifier);
    return attemptModel;
  }

  private async registerDevice(patient: PatientModel, device: DeviceModel): Promise<void> {
    const { insertId } = await this.upsertDevice.execute({
      patientId: patient.id!,
      os: device.os,
      identifier: device.identifier,
      name: device.name,
      expiresAt: device.expiresAt,
    });

    patient.inyectNewDevice(Number(insertId));
  }

  private async refreshDevices(patient: PatientModel): Promise<void> {
    await this.cleanUnusedDevices.execute(patient.account!.id!);
  }

  private async generateJwtToken(patient: PatientModel): Promise<PatientSessionModel> {
    const token = await this.jwtManager.generateToken(patient.toSessionPayload());
    const patientSessionModel = new PatientSessionModel(patient, token);

    return patientSessionModel;
  }

  private async persistSession(sessionModel: PatientSessionModel): Promise<void> {
    await this.saveSessionRepository.execute(sessionModel.toPersisSessionPayload());
  }
}

export class SignInPatientInteractorBuilder {
  static buildRegular(): SignInPatientInteractor {
    return new SignInPatientInteractor(
      new GetAuthAttemptsRepository(),
      new SignInRegularStrategy(
        new SignInPatientRepository(),
        EncryptionManagerBuilder.buildSha512(),
        new UpsertTryCountRepository(),
        new UpdateBlockedRepository(),
        new CleanBlockedRepository(),
      ),
      new CleanUnusedDevicesRepository(),
      new UpsertSessionRepository(),
      new UpsertDeviceRepository(),
      JWTManagerBuilder.buildSessionConfig(),
    );
  }

  static buildBiometric(): SignInPatientInteractor {
    return new SignInPatientInteractor(
      new GetAuthAttemptsRepository(),
      new SignInBiometricStrategy(
        new SignInBiometricRepository(),
        EncryptionManagerBuilder.buildSha512(),
        new CleanBlockedRepository(),
      ),
      new CleanUnusedDevicesRepository(),
      new UpsertSessionRepository(),
      new UpsertDeviceRepository(),
      JWTManagerBuilder.buildSessionConfig(),
    );
  }
}
