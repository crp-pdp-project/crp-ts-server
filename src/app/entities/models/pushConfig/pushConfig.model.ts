import { DynamicPushHelper } from 'src/general/helpers/dynamicPush.helper';

import { PushConfigDM } from '../../dms/pushConfigs.dm';
import { PushConfigDTO } from '../../dtos/service/pushConfig.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';

export class PushConfigModel extends BaseModel {
  readonly #rawConfig?: PushConfigDM['config'];

  constructor(pushConfig?: PushConfigDTO) {
    super();

    this.#rawConfig = pushConfig?.config;
  }

  validateConfig(): void {
    if (!this.#rawConfig) {
      throw ErrorModel.notFound({ message: 'No configuration found for the current screen' });
    }
  }

  isValidPayload(payload: Record<string, unknown>): Record<string, unknown> {
    this.validateConfig();

    const schema = DynamicPushHelper.getPushSchema(this.#rawConfig!);
    const parsed = schema.parse(payload);

    return parsed;
  }
}
