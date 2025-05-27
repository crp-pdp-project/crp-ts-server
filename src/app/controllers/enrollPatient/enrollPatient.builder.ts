import { EnrollPatientController } from 'src/app/controllers/enrollPatient/enrollPatient.controller';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientExternalModel } from 'src/app/entities/models/patientExternal.model';
import { PatientExternalSessionModel } from 'src/app/entities/models/patientExternalSession.model';
import { PatientVerificationInteractor } from 'src/app/interactors/patientVerification/patientVerification.interactor';
import { PatientVerificationEnrollStrategy } from 'src/app/interactors/patientVerification/strategies/patientVerificationEnroll.strategy';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SessionInteractor } from 'src/app/interactors/session/session.interactor';
import { EnrollSessionStrategy } from 'src/app/interactors/session/strategies/enrollSession.strategy';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { GetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { SavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpsertSessionRepository } from 'src/app/repositories/database/upsertSession.respository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { ConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { AuthAttemptManager } from 'src/general/managers/authAttempt.manager';
import { AuthAttemptEnroll } from 'src/general/managers/config/authAttempt.config';
import { JWTConfigEnroll } from 'src/general/managers/config/jwt.config';
import { JWTManager } from 'src/general/managers/jwt.manager';

export class EnrollPatientBuilder {
  static build(): EnrollPatientController {
    return new EnrollPatientController(
      this.buildInteractor(),
      this.buildSessionInteractor(),
      this.buildResponseInteractor(),
    );
  }

  private static buildInteractor(): PatientVerificationInteractor {
    return new PatientVerificationInteractor(
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      this.buildVerificationStrategy(),
      this.buildAuthAttemptManager(),
    );
  }

  private static buildSessionInteractor(): SessionInteractor<PatientExternalModel, PatientExternalSessionModel> {
    return new SessionInteractor(new EnrollSessionStrategy(), new UpsertSessionRepository(), this.buildJWTManager());
  }

  private static buildJWTManager(): JWTManager<SessionPayloadDTO> {
    return new JWTManager<SessionPayloadDTO>(new JWTConfigEnroll());
  }

  private static buildResponseInteractor(): ResponseInteractor<PatientExternalSessionModel> {
    return new ResponseInteractor(new DataResponseStrategy(PatientVerificationOutputDTOSchema));
  }

  private static buildVerificationStrategy(): PatientVerificationEnrollStrategy {
    return new PatientVerificationEnrollStrategy(new ConfirmPatientRepository(), new SavePatientRepository());
  }

  private static buildAuthAttemptManager(): AuthAttemptManager {
    return new AuthAttemptManager(
      new AuthAttemptEnroll(),
      new GetAuthAttemptsRepository(),
      new UpsertTryCountRepository(),
      new UpdateBlockedRepository(),
      new CleanBlockedRepository(),
    );
  }
}
