import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { AuthFlowIdentifier } from 'src/general/enums/flowIdentifier.enum';

export interface IAuthAttemptConfig {
  readonly flowIdentifier: AuthFlowIdentifier;
  readonly maxTries: number;
  readonly blockExpMinutes: number;
  readonly tryCountExpMinutes: number;
  readonly blockErrorMessage: ClientErrorMessages;
  readonly tryErrorMessage: ClientErrorMessages;
}

export class AuthAttemptSignIn implements IAuthAttemptConfig {
  readonly flowIdentifier = AuthFlowIdentifier.SING_IN;
  readonly maxTries = 3;
  readonly blockExpMinutes = 60;
  readonly tryCountExpMinutes = 15;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.AUTH_INVALID;
}

export class AuthAttemptEnroll implements IAuthAttemptConfig {
  readonly flowIdentifier = AuthFlowIdentifier.ENROLL;
  readonly maxTries = 5;
  readonly blockExpMinutes = 15;
  readonly tryCountExpMinutes = 5;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.WRONG_OTP;
}

export class AuthAttemptRecover implements IAuthAttemptConfig {
  readonly flowIdentifier = AuthFlowIdentifier.RECOVER;
  readonly maxTries = 5;
  readonly blockExpMinutes = 15;
  readonly tryCountExpMinutes = 5;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.WRONG_OTP;
}
