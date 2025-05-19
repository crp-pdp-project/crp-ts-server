import {
  SignInBiometricBodyDTO,
  SignInBiometricBodyDTOSchema,
} from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInBiometricRepository } from 'src/app/repositories/database/signInBiometric.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';
import { ISignInManager } from 'src/general/managers/signIn.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInBiometricStrategy implements ISignInStrategy {
  constructor(
    private readonly signInBiometric: ISignInBiometricRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly signInManager: ISignInManager,
  ) {}

  async signIn(body: SignInBiometricBodyDTO): Promise<PatientDTO> {
    const validatedBody = this.validateInput(body);
    const patient = await this.getPatientAccount(validatedBody);
    this.signInManager.checkBlocked(patient.account!);
    await this.validatePassword(validatedBody, patient.account!);

    return patient;
  }

  private validateInput(body: SignInBiometricBodyDTO): SignInBiometricBodyDTO {
    return SignInBiometricBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInBiometricBodyDTO): Promise<PatientDTO> {
    const patient = await this.signInBiometric.execute(body.documentType, body.documentNumber);

    if (!patient) {
      throw ErrorModel.unauthorized(ClientErrorMessages.SIGN_IN_INVALID);
    }

    return patient;
  }

  private async validatePassword(body: SignInBiometricBodyDTO, account: AccountDTO): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      body.password,
      account.biometricHash!,
      account.biometricSalt!,
    );

    if (isValidPassword) {
      await this.signInManager.handleSuccess(account);
    } else {
      await this.signInManager.handleFailure(account);
    }
  }
}
