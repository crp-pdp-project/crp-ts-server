import { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { DeviceConstants } from 'src/general/contants/device.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { ErrorModel } from '../error/error.model';

import { ValidateMobileStrategy } from './strategies/validateMobile.strategy';
import { ValidateWebStrategy } from './strategies/validateWeb.strategy';

export enum Devices {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export interface IValidateOSStrategy {
  validate(): void;
}

export class DeviceValidationFactory {
  private static readonly strategies: Record<Devices, new (device: DeviceModel) => IValidateOSStrategy> = {
    [Devices.WEB]: ValidateWebStrategy,
    [Devices.IOS]: ValidateMobileStrategy,
    [Devices.ANDROID]: ValidateMobileStrategy,
  };

  static validate(device: DeviceModel): void {
    const Strategy = this.strategies[device.os as Devices];
    if (!Strategy) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.INVALID_API_CALL });
    }
    new Strategy(device).validate();
  }
}

export class DeviceModel extends BaseModel {
  readonly id?: number;
  readonly patientId?: number;
  readonly accountId?: number;
  readonly os?: Devices;
  readonly identifier?: string;
  readonly name?: string;
  readonly pushToken?: string;
  readonly biometricHash?: string;
  readonly biometricSalt?: string;
  readonly expiresAt?: string;

  constructor(device: DeviceDTO) {
    super();

    this.id = device.id;
    this.patientId = device.patientId;
    this.os = device.os;
    this.identifier = device.identifier;
    this.name = device.name;
    this.pushToken = device.pushToken ?? undefined;
    this.biometricHash = device.biometricHash ?? undefined;
    this.biometricSalt = device.biometricSalt ?? undefined;
    this.expiresAt = DateHelper.addDays(DeviceConstants.EXPIRATION_DAYS, 'dbDateTime');
  }

  validateOS(): void {
    DeviceValidationFactory.validate(this);
  }

  static extractDevice(model?: DeviceModel): DeviceModel {
    if (!model) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.INVALID_API_CALL });
    }

    return model;
  }
}
