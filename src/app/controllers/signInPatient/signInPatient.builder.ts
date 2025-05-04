import { SignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { SignInPatientInteractor } from 'src/app/interactors/signInPatient/signInPatient.interactor';
import { SignInBiometricStrategy } from 'src/app/interactors/signInPatient/strategies/signInBiometric.strategy';
import { SignInRegularStrategy } from 'src/app/interactors/signInPatient/strategies/signInRegular.strategy';
import { SignInSessionInteractor } from 'src/app/interactors/signInSession/signInSession.interactor';
import { SaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { SignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { SignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { EncryptionConfigSha512 } from 'src/general/managers/config/encryption.config';
import { JWTConfigSession } from 'src/general/managers/config/jwt.config';
import { EncryptionManager } from 'src/general/managers/encryption.manager';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class SignInPatientBuilder {
  static buildRegular(): SignInPatientController {
    const signInPatient = new SignInPatientRepository();
    const saveSession = new SaveSessionRepository();
    const encryptionConfig = new EncryptionConfigSha512();
    const jwtConfig = new JWTConfigSession();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);
    const responseStrategy = new SuccessResponseStrategy(SignInPatientOutputDTOSchema);
    const signInStrategy = new SignInRegularStrategy(signInPatient, encryptionManager);
    const signInInteractor = new SignInPatientInteractor(signInStrategy);
    const sessionInteractor = new SignInSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientSessionModel>(responseStrategy);

    return new SignInPatientController(signInInteractor, sessionInteractor, responseInteractor);
  }

  static buildBiometric(): SignInPatientController {
    const signInBiometric = new SignInBiometricRepository();
    const saveSession = new SaveSessionRepository();
    const encryptionConfig = new EncryptionConfigSha512();
    const jwtConfig = new JWTConfigSession();
    const encryptionManager = new EncryptionManager(encryptionConfig);
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);
    const responseStrategy = new SuccessResponseStrategy(SignInPatientOutputDTOSchema);
    const signInStrategy = new SignInBiometricStrategy(signInBiometric, encryptionManager);
    const signInInteractor = new SignInPatientInteractor(signInStrategy);
    const sessionInteractor = new SignInSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientSessionModel>(responseStrategy);

    return new SignInPatientController(signInInteractor, sessionInteractor, responseInteractor);
  }
}
