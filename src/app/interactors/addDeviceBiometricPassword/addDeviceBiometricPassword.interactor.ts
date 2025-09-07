import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { AddDeviceBiometricPasswordBodyDTO } from 'src/app/entities/dtos/input/addDeviceBiometricPassword.input.dto';
import { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  ISaveBiometricPasswordRepository,
  SaveBiometricPasswordRepository,
} from 'src/app/repositories/database/saveBiometricPassword.repository';
import {
  EncryptionManagerBuilder,
  IEncryptionManager,
  PasswordHashResult,
} from 'src/general/managers/encryption/encryption.manager';

export interface IAddDeviceBiometricPasswordInteractor {
  add(body: AddDeviceBiometricPasswordBodyDTO, session: SignInSessionModel): Promise<void>;
}

export class AddDeviceBiometricPasswordInteractor implements IAddDeviceBiometricPasswordInteractor {
  constructor(
    private readonly saveBiometricPassowrd: ISaveBiometricPasswordRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async add(body: AddDeviceBiometricPasswordBodyDTO, session: SignInSessionModel): Promise<void> {
    const { hash, salt } = await this.generatePassword(body.password);
    await this.persistPassword(session.patient.device.id, {
      biometricHash: hash,
      biometricSalt: salt,
    });
  }

  private async generatePassword(password: string): Promise<PasswordHashResult> {
    return this.encryptionManager.hashPassword(password);
  }

  private async persistPassword(id: DeviceDM['id'], device: DeviceDTO): Promise<void> {
    await this.saveBiometricPassowrd.execute(id, device);
  }
}

export class AddDeviceBiometricPasswordInteractorBuilder {
  static build(): AddDeviceBiometricPasswordInteractor {
    return new AddDeviceBiometricPasswordInteractor(
      new SaveBiometricPasswordRepository(),
      EncryptionManagerBuilder.buildSha512(),
    );
  }
}
