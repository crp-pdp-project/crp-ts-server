import { DateHelper } from 'src/general/helpers/date.helper';

import type { SignInSessionModel } from '../../session/signInSession.model';
import type { GenerateMDDStrategy } from '../posConfig.model';
import { MDDVariants } from '../posConfig.model';

export class MDD77Strategy implements GenerateMDDStrategy {
  genMDD(session: SignInSessionModel): Record<string, number> {
    return { [MDDVariants.MDD77]: DateHelper.countFrom('day', session.patient.createdAt) };
  }
}
