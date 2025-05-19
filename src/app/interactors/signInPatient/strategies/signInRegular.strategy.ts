import { SignInPatientBodyDTO, SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';
import { ISignInManager } from 'src/general/managers/signIn.manager';

import { ISignInStrategy } from '../signInPatient.interactor';

export class SignInRegularStrategy implements ISignInStrategy {
  constructor(
    private readonly signInPatient: ISignInPatientRepository,
    private readonly encryptionManager: IEncryptionManager,
    private readonly signInManager: ISignInManager,
  ) {}

  async signIn(body: SignInPatientBodyDTO): Promise<PatientDTO> {
    const validatedBody = this.validateInput(body);
    const patient = await this.getPatientAccount(validatedBody);
    this.signInManager.checkBlocked(patient.account!);
    await this.validatePassword(validatedBody, patient.account!);

    return patient;
  }

  private validateInput(body: SignInPatientBodyDTO): SignInPatientBodyDTO {
    return SignInPatientBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: SignInPatientBodyDTO): Promise<PatientDTO> {
    const patient = await this.signInPatient.execute(body.documentType, body.documentNumber);

    if (!patient) {
      throw ErrorModel.unauthorized(ClientErrorMessages.SIGN_IN_INVALID);
    }

    return patient;
  }

  private async validatePassword(body: SignInPatientBodyDTO, account: AccountDTO): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      body.password,
      account.passwordHash!,
      account.passwordSalt!,
    );

    if (isValidPassword) {
      await this.signInManager.handleSuccess(account);
    } else {
      await this.signInManager.handleFailure(account);
    }
  }
}
