import { PosConstants } from 'src/general/contants/pos.constants';

import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD75Strategy implements GenerateMDDStrategy {
  genMDD(): Record<string, string> {
    return { [MDDVariants.MDD75]: PosConstants.DEFAULT_MDD75 };
  }
}
