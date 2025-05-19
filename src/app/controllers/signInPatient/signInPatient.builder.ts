import { SignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SessionInteractor } from 'src/app/interactors/session/session.interactor';
import { PatientSessionStrategy } from 'src/app/interactors/session/strategies/signInSession.strategy';
import { ISignInStrategy, SignInPatientInteractor } from 'src/app/interactors/signInPatient/signInPatient.interactor';
import { SignInBiometricStrategy } from 'src/app/interactors/signInPatient/strategies/signInBiometric.strategy';
import { SignInRegularStrategy } from 'src/app/interactors/signInPatient/strategies/signInRegular.strategy';
import { CleanAccountBlockedRepository } from 'src/app/repositories/database/cleanAccountBlocked.repository';
import { SaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { SignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { SignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { UpdateAccountBlockedRepository } from 'src/app/repositories/database/updateAccountBlocked.repository';
import { UpdateAccountTryCountRepository } from 'src/app/repositories/database/updateAccountTryCount.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { JWTConfigSession } from 'src/general/managers/config/jwt.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';
import { JWTManager } from 'src/general/managers/jwt.manager';
import { SignInManager } from 'src/general/managers/signIn.manager';

export class SignInPatientBuilder {
  private static buildController(strategy: ISignInStrategy): SignInPatientController {
    const saveSession = new SaveSessionRepository();
    const jwtConfig = new JWTConfigSession();
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);

    const sessionStrategy = new PatientSessionStrategy();
    const responseStrategy = new DataResponseStrategy(SignInPatientOutputDTOSchema);
    const signInInteractor = new SignInPatientInteractor(strategy);
    const sessionInteractor = new SessionInteractor(sessionStrategy, saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientSessionModel>(responseStrategy);

    return new SignInPatientController(signInInteractor, sessionInteractor, responseInteractor);
  }

  private static buildSignInManager(): SignInManager {
    const updateAccountBlocked = new UpdateAccountBlockedRepository();
    const updateAccountTryCount = new UpdateAccountTryCountRepository();
    const cleanAccountBlocked = new CleanAccountBlockedRepository();

    return new SignInManager(updateAccountTryCount, updateAccountBlocked, cleanAccountBlocked);
  }

  static buildRegular(): SignInPatientController {
    const signInPatient = new SignInPatientRepository();
    const encryptionConfig = new EncryptionConfigSha512();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const signInManager = this.buildSignInManager();

    const signInStrategy = new SignInRegularStrategy(signInPatient, encryptionManager, signInManager);
    return this.buildController(signInStrategy);
  }

  static buildBiometric(): SignInPatientController {
    const signInBiometric = new SignInBiometricRepository();
    const encryptionConfig = new EncryptionConfigSha512();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const signInManager = this.buildSignInManager();

    const signInStrategy = new SignInBiometricStrategy(signInBiometric, encryptionManager, signInManager);
    return this.buildController(signInStrategy);
  }
}
