import { EnrollPatientController } from 'src/app/controllers/enrollPatient/enrollPatient.controller';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientExternalSessionModel } from 'src/app/entities/models/patientExternalSession.model';
import { PatientVerificationInteractor } from 'src/app/interactors/patientVerification/patientVerification.interactor';
import { PatientVerificationEnrollStrategy } from 'src/app/interactors/patientVerification/strategies/patientVerificationEnroll.strategy';
import { PatientVefiricationSessionInteractor } from 'src/app/interactors/patientVerificationSession/patientVerificationSession.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { SavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { SaveSessionRepository } from 'src/app/repositories/database/saveSession.respository';
import { ConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { JWTConfigEnroll } from 'src/general/managers/config/jwt.config';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class EnrollPatientBuilder {
  static build(): EnrollPatientController {
    const getPatientAccount = new GetPatientAccountRepository();
    const searchPatient = new SearchPatientRepository();
    const confirmPatient = new ConfirmPatientRepository();
    const savePatient = new SavePatientRepository();
    const saveSession = new SaveSessionRepository();
    const jwtConfig = new JWTConfigEnroll();
    const jwtManager = new JWTManager<SessionPayloadDTO>(jwtConfig);
    const verificationStrategy = new PatientVerificationEnrollStrategy(confirmPatient, savePatient);
    const responseStrategy = new SuccessResponseStrategy(PatientVerificationOutputDTOSchema);
    const verificationInteractor = new PatientVerificationInteractor(
      getPatientAccount,
      searchPatient,
      verificationStrategy,
    );
    const sessionInteractor = new PatientVefiricationSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientExternalSessionModel>(responseStrategy);

    return new EnrollPatientController(verificationInteractor, sessionInteractor, responseInteractor);
  }
}
