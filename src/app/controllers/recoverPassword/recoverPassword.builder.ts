import { RecoverPasswordController } from 'src/app/controllers/recoverPassword/recoverPassword.controller';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientExternalSessionModel } from 'src/app/entities/models/patientExternalSession.model';
import { PatientVerificationInteractor } from 'src/app/interactors/patientVerification/patientVerification.interactor';
import { PatientVerificationRecoverStrategy } from 'src/app/interactors/patientVerification/strategies/patientVerificationRecover.strategy';
import { PatientVefiricationSessionInteractor } from 'src/app/interactors/patientVerificationSession/patientVerificationSession.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { SaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { JWTConfigRecover } from 'src/general/managers/config/jwt.config';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class RecoverPasswordBuilder {
  static build(): RecoverPasswordController {
    const getPatientAccount = new GetPatientAccountRepository();
    const searchPatient = new SearchPatientRepository();
    const saveSession = new SaveSessionRepository();
    const jwtConfig = new JWTConfigRecover();
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);
    const verificationStrategy = new PatientVerificationRecoverStrategy();
    const responseStrategy = new SuccessResponseStrategy(PatientVerificationOutputDTOSchema);
    const verificationInteractor = new PatientVerificationInteractor(
      getPatientAccount,
      searchPatient,
      verificationStrategy,
    );
    const sessionInteractor = new PatientVefiricationSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientExternalSessionModel>(responseStrategy);

    return new RecoverPasswordController(verificationInteractor, sessionInteractor, responseInteractor);
  }
}
