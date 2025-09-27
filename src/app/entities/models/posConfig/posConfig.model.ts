import { TextHelper } from 'src/general/helpers/text.helper';

import { PatientExternalDTO } from '../../dtos/service/patientExternal.dto';
import { POSConfigDTO } from '../../dtos/service/posConfig.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';
import { SignInSessionModel } from '../session/signInSession.model';

import { MDD21Strategy } from './strategies/mdd21.strategy';
import { MDD32Strategy } from './strategies/mdd32.strategy';
import { MDD4Strategy } from './strategies/mdd4.strategy';
import { MDD75Strategy } from './strategies/mdd75.strategy';
import { MDD77Strategy } from './strategies/mdd77.strategy';
import { EnvHelper } from 'src/general/helpers/env.helper';

export interface GenerateMDDStrategy {
  genMDD(session: SignInSessionModel, external: PatientExternalDTO): Record<string, unknown>;
}

export enum MDDVariants {
  MDD4 = 'MDD4',
  MDD21 = 'MDD21',
  MDD32 = 'MDD32',
  MDD75 = 'MDD75',
  MDD77 = 'MDD77',
}

export class GenerateMDDStrategyFactory {
  private static readonly strategyMap: Record<MDDVariants, new () => GenerateMDDStrategy> = {
    [MDDVariants.MDD4]: MDD4Strategy,
    [MDDVariants.MDD21]: MDD21Strategy,
    [MDDVariants.MDD32]: MDD32Strategy,
    [MDDVariants.MDD75]: MDD75Strategy,
    [MDDVariants.MDD77]: MDD77Strategy,
  };

  static getStrategy(mdd: string): GenerateMDDStrategy {
    const Strategy = this.strategyMap[mdd as MDDVariants];

    if (!Strategy) {
      throw ErrorModel.notFound({ message: 'MDD not recognized' });
    }

    return new Strategy();
  }
}

export class POSConfigModel extends BaseModel {
  readonly user?: string;
  readonly password?: string;
  readonly commerceCode?: string;
  readonly channel?: string;
  readonly host?: string;
  readonly correlative?: string;
  readonly token?: string;
  readonly pinHash?: string;
  readonly env: string;
  readonly MDD?: Record<string, unknown>;

  constructor(posConfig: POSConfigDTO, session: SignInSessionModel, external: PatientExternalDTO) {
    super();

    this.user = posConfig.user;
    this.password = posConfig.password;
    this.commerceCode = posConfig.commerceCode;
    this.channel = posConfig.channel;
    // this.host = posConfig.host;
    this.host = 'https://apisandbox.vnforappstest.com';
    this.correlative = posConfig.correlative ? TextHelper.padTextLength(posConfig.correlative) : undefined;
    this.token = posConfig.token;
    this.pinHash = posConfig.pinHash;
    this.env = EnvHelper.get('NIUBIZ_ENVIRONMENT');
    this.MDD = posConfig.MDDList ? this.generateMDDObject(posConfig.MDDList, session, external) : undefined;
  }

  private generateMDDObject(
    MDDlist: string,
    session: SignInSessionModel,
    external: PatientExternalDTO,
  ): Record<string, unknown> {
    let MDDObject = {};

    MDDlist.split(',').forEach((mdd) => {
      const generationStrategy = GenerateMDDStrategyFactory.getStrategy(mdd);

      MDDObject = {
        ...MDDObject,
        ...generationStrategy.genMDD(session, external),
      };
    });

    return MDDObject;
  }
}
