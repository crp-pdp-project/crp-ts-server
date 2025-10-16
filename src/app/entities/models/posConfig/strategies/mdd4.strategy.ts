import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { PosConstants } from 'src/general/contants/pos.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

import { SignInSessionModel } from '../../session/signInSession.model';
import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD4Strategy implements GenerateMDDStrategy {
  private readonly overrideEmail?: string = EnvHelper.getOptional('NIUBIZ_EMAIL');

  genMDD(_: SignInSessionModel, patient: PatientExternalDTO): Record<string, string> {
    return { [MDDVariants.MDD4]: this.overrideEmail ?? patient.email ?? PosConstants.DEFAULT_EMAIL };
  }
}
