import { BaseHeadersDTO } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';

export interface IValidateHeadersInteractor {
  validate(headers: BaseHeadersDTO): DeviceModel;
}

export class ValidateHeadersInteractor implements IValidateHeadersInteractor {
  validate(headers: BaseHeadersDTO): DeviceModel {
    const deviceModel = new DeviceModel({
      os: headers['X-Os'],
      identifier: headers['X-Device-Id'],
      name: headers['X-Device-Name'],
      pushToken: headers['X-Push-Token'],
    });
    deviceModel.validateOS();

    return deviceModel;
  }
}
