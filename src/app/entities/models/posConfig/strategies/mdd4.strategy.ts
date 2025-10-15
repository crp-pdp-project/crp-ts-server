import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { PosConstants } from 'src/general/contants/pos.constants';

import { SignInSessionModel } from '../../session/signInSession.model';
import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD4Strategy implements GenerateMDDStrategy {
  genMDD(_: SignInSessionModel, patient: PatientExternalDTO): Record<string, string> {
    // return { [MDDVariants.MDD4]: patient.email ?? PosConstants.DEFAULT_EMAIL };
    return { [MDDVariants.MDD4]: 'ACCEPT@SASTEST.COM' };
  }
}
