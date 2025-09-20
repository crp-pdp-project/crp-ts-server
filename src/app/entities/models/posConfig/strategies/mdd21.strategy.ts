import { PosConstants } from 'src/general/contants/pos.constants';

import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD21Strategy implements GenerateMDDStrategy {
  genMDD(): Record<string, number> {
    return { [MDDVariants.MDD21]: PosConstants.DEFAULT_MDD21 };
  }
}
