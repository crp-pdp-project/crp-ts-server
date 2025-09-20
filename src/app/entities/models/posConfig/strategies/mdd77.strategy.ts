import { DateHelper } from 'src/general/helpers/date.helper';

import { SignInSessionModel } from '../../session/signInSession.model';
import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD77Strategy implements GenerateMDDStrategy {
  genMDD(session: SignInSessionModel): Record<string, number> {
    return { [MDDVariants.MDD77]: DateHelper.countFromNow(session.patient.createdAt, 'day') };
  }
}
