import { AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';
import enrollEmailTemplate from 'src/general/templates/enrollEmail.template';
import enrollSmsTemplate from 'src/general/templates/enrollSMS.template';
import recoverEmailTemplate from 'src/general/templates/recoverEmail.template';
import recoverSmsTemplate from 'src/general/templates/recoverSMS.template';

export interface IVerificationOtpConfig {
  readonly emailTemplate: string;
  readonly smsTemplate: string;
  readonly subject: EmailSubjects;
  readonly flowIdentifier: AuthFlowIdentifier;
}

export class VerificationOtpEnroll implements IVerificationOtpConfig {
  readonly emailTemplate = enrollEmailTemplate;
  readonly smsTemplate = enrollSmsTemplate;
  readonly subject = EmailSubjects.ENROLL_SUBJECT;
  readonly flowIdentifier = AuthFlowIdentifier.ENROLL;
}

export class VerificationOtpRecover implements IVerificationOtpConfig {
  readonly emailTemplate = recoverEmailTemplate;
  readonly smsTemplate = recoverSmsTemplate;
  readonly subject = EmailSubjects.RECOVER_SUBJECT;
  readonly flowIdentifier = AuthFlowIdentifier.RECOVER;
}
