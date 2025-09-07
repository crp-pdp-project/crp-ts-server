import { DeviceModel, IValidateOSStrategy } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export class ValidateMobileStrategy implements IValidateOSStrategy {
  constructor(private readonly device: DeviceModel) {}

  validate(): void {
    if (!this.device.identifier) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.INVALID_API_CALL });
    }
  }
}
