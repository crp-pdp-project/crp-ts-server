import { EnrollPatientController } from 'src/app/controllers/enrollPatient/enrollPatient.controller';
import { EnrollPatientOutputDTOSchema } from 'src/app/entities/dtos/output/enrollPatient.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientEnrollSessionModel } from 'src/app/entities/models/patientEnrollSession.model';
import { EnrollPatientInteractor } from 'src/app/interactors/enrollPatient/enrollPatient.interactor';
import { EnrollSessionInteractor } from 'src/app/interactors/enrollSession/enrollSession.interactor';
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
    const responseStrategy = new SuccessResponseStrategy(EnrollPatientOutputDTOSchema);
    const enrollInteractor = new EnrollPatientInteractor(getPatientAccount, searchPatient, confirmPatient, savePatient);
    const sessionInteractor = new EnrollSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientEnrollSessionModel>(responseStrategy);

    return new EnrollPatientController(enrollInteractor, sessionInteractor, responseInteractor);
  }
}
