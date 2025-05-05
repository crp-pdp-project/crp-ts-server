import {
  SignInBiometricBodyDTO,
  SignInBiometricBodyDTOSchema,
} from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInBiometricStrategy implements ISignInStrategy {
  constructor(
    private readonly signInBiometric: ISignInBiometricRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async validateAccount(body: SignInBiometricBodyDTO): Promise<AccountDTO> {
    const validatedBody = this.validateInput(body);
    const account = await this.getPatientAccount(validatedBody);
    await this.validatePassword(validatedBody, account);

    return account;
  }

  private validateInput(body: SignInBiometricBodyDTO): SignInBiometricBodyDTO {
    return SignInBiometricBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInBiometricBodyDTO): Promise<AccountDTO> {
    const account = await this.signInBiometric.execute(body.documentType, body.documentNumber);

    if (!account || !account?.patient) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
    }

    return account;
  }

  private async validatePassword(body: SignInBiometricBodyDTO, account: AccountDTO): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      body.password,
      account.biometricHash!,
      account.biometricSalt!,
    );

    if (!isValidPassword) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
    }
  }
}
