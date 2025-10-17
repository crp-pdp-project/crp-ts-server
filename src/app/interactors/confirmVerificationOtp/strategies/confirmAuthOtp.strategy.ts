import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { IConfirmVerificationOTPStrategy } from '../confirmVerificationOtp.interactor';

export class ConfirmAuthOTPStrategy implements IConfirmVerificationOTPStrategy {
  async validate(session: SessionModel, otp: string): Promise<PatientModel> {
    const signInSession = this.validateSession(session);

    if (signInSession.otp !== otp) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.WRONG_OTP });
    }
    const model = this.extractModel(signInSession);

    return Promise.resolve(model);
  }

  private validateSession(session: SessionModel): SignInSessionModel {
    const model = SessionModel.validateSessionInstance(Audiences.SIGN_IN, session);
    model.validateOtpLimit();

    return model;
  }

  private extractModel(session: SignInSessionModel): PatientModel {
    const model = new PatientModel(session.patient);

    return model;
  }
}
