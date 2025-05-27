import { SignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SessionInteractor } from 'src/app/interactors/session/session.interactor';
import { PatientSessionStrategy } from 'src/app/interactors/session/strategies/signInSession.strategy';
import { ISignInStrategy, SignInPatientInteractor } from 'src/app/interactors/signInPatient/signInPatient.interactor';
import { SignInBiometricStrategy } from 'src/app/interactors/signInPatient/strategies/signInBiometric.strategy';
import { SignInRegularStrategy } from 'src/app/interactors/signInPatient/strategies/signInRegular.strategy';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { SignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { SignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpsertSessionRepository } from 'src/app/repositories/database/upsertSession.respository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { AuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { AuthAttemptSignIn } from 'src/general/managers/config/authAttempt.config';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { JWTConfigSession } from 'src/general/managers/config/jwt.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class SignInPatientBuilder {
  static buildRegular(): SignInPatientController {
    const signInStrategy = new SignInRegularStrategy(
      new SignInPatientRepository(),
      this.buildEncryptionManager(),
      this.buildAuthAttemptManager(),
    );
    return this.buildController(signInStrategy);
  }

  static buildBiometric(): SignInPatientController {
    const signInStrategy = new SignInBiometricStrategy(
      new SignInBiometricRepository(),
      this.buildEncryptionManager(),
      this.buildAuthAttemptManager(),
    );
    return this.buildController(signInStrategy);
  }

  private static buildController(strategy: ISignInStrategy): SignInPatientController {
    return new SignInPatientController(
      new SignInPatientInteractor(strategy),
      this.buildSessionInteractor(),
      this.buildResponseInteractor(),
    );
  }

  private static buildSessionInteractor(): SessionInteractor<PatientModel, PatientSessionModel> {
    return new SessionInteractor(new PatientSessionStrategy(), new UpsertSessionRepository(), this.buildJWTManager());
  }

  private static buildResponseInteractor(): ResponseInteractor<PatientSessionModel> {
    return new ResponseInteractor(new DataResponseStrategy(SignInPatientOutputDTOSchema));
  }

  private static buildAuthAttemptManager(): AuthAttemptManager {
    return new AuthAttemptManager(
      new AuthAttemptSignIn(),
      new GetAuthAttemptsRepository(),
      new UpsertTryCountRepository(),
      new UpdateBlockedRepository(),
      new CleanBlockedRepository(),
    );
  }

  private static buildJWTManager(): JWTManager<SessionPayloadDTO> {
    return new JWTManager<SessionPayloadDTO>(new JWTConfigSession());
  }

  private static buildEncryptionManager(): EncryptionManager {
    return new EncryptionManager(new EncryptionConfigSha512());
  }
}
