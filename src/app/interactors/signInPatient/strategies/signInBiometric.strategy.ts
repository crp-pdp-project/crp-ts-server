import { SignInPatientBodyDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
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

  async validateAccount(body: SignInPatientBodyDTO): Promise<AccountDTO> {
    const account = await this.getPatientAccount(body);
    await this.validatePassword(body, account);

    return account;
  }

  private async getPatientAccount(body: SignInPatientBodyDTO): Promise<AccountDTO> {
    const account = await this.signInBiometric.execute(body.documentType, body.documentNumber);

    if (!account || !account?.patient) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
    }

    return account;
  }

  private async validatePassword(body: SignInPatientBodyDTO, account: AccountDTO): Promise<void> {
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
