import { RecoverPasswordController } from 'src/app/controllers/recoverPassword/recoverPassword.controller';
import { RecoverPasswordOutputDTOSchema } from 'src/app/entities/dtos/output/recoverPassword.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientRecoverSessionModel } from 'src/app/entities/models/patientRecoverSession.model';
import { RecoverPasswordInteractor } from 'src/app/interactors/recoverPassword/recoverPassword.interactor';
import { RecoverSessionInteractor } from 'src/app/interactors/recoverSession/recoverSession.interactor';
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
    const responseStrategy = new SuccessResponseStrategy(RecoverPasswordOutputDTOSchema);
    const recoverInteractor = new RecoverPasswordInteractor(getPatientAccount, searchPatient);
    const sessionInteractor = new RecoverSessionInteractor(saveSession, jwtManager);
    const responseInteractor = new ResponseInteractor<PatientRecoverSessionModel>(responseStrategy);

    return new RecoverPasswordController(recoverInteractor, sessionInteractor, responseInteractor);
  }
}
