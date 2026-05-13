import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IAuthAttemptConfig {
  readonly maxTries: number;
  readonly blockExpMinutes: number;
  readonly tryCountExpMinutes: number;
  readonly blockErrorMessage: ClientErrorMessages;
  readonly tryErrorMessage: ClientErrorMessages;
}

export class AuthAttemptSignIn implements IAuthAttemptConfig {
  readonly maxTries = 3;
  readonly blockExpMinutes = 60;
  readonly tryCountExpMinutes = 15;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.AUTH_INVALID;
}

export class AuthAttemptEnroll implements IAuthAttemptConfig {
  readonly maxTries = 5;
  readonly blockExpMinutes = 15;
  readonly tryCountExpMinutes = 5;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.WRONG_OTP;
}

export class AuthAttemptRecover implements IAuthAttemptConfig {
  readonly maxTries = 5;
  readonly blockExpMinutes = 15;
  readonly tryCountExpMinutes = 5;
  readonly blockErrorMessage = ClientErrorMessages.DOCUMENT_BLOCKED;
  readonly tryErrorMessage = ClientErrorMessages.WRONG_OTP;
}
