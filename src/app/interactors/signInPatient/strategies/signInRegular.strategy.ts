import { SignInPatientBodyDTO, SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInRegularStrategy implements ISignInStrategy {
  constructor(
    private readonly signInPatient: ISignInPatientRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async validateAccount(body: SignInPatientBodyDTO): Promise<{ account: AccountDTO; isValidPassword: boolean }> {
    const validatedBody = this.validateInput(body);
    const account = await this.getPatientAccount(validatedBody);
    const isValidPassword = await this.validatePassword(validatedBody, account);

    return { account, isValidPassword };
  }

  private validateInput(body: SignInPatientBodyDTO): SignInPatientBodyDTO {
    return SignInPatientBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInPatientBodyDTO): Promise<AccountDTO> {
    const account = await this.signInPatient.execute(body.documentType, body.documentNumber);

    if (!account || !account?.patient) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
    }

    return account;
  }

  private async validatePassword(body: SignInPatientBodyDTO, account: AccountDTO): Promise<boolean> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      body.password,
      account.passwordHash!,
      account.passwordSalt!,
    );

    return isValidPassword;
  }
}
