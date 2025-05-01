import { FastifyRequest } from 'fastify';

import {
  SignInPatientBodyDTO,
  SignInPatientBodyDTOSchema,
  SignInPatientInputDTO,
} from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { ISignInPatientRepository } from 'src/app/repositories/database/signInPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { IEncryptionManager } from 'src/general/managers/encryption.manager';

export interface ISignInPatientInteractor {
  signIn(input: FastifyRequest<SignInPatientInputDTO>): Promise<PatientModel | ErrorModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  constructor(
    private readonly signInPatient: ISignInPatientRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async signIn(input: FastifyRequest<SignInPatientInputDTO>): Promise<PatientModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      const account = await this.getPatientAccount(body);
      await this.validatePassword(body, account);

      return new PatientModel(account.patient!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
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

  private async validatePassword(body: SignInPatientBodyDTO, account: AccountDTO): Promise<void> {
    const isValidPassword = await this.encryptionManager.comparePassword(
      body.password,
      account.passwordHash!,
      account.passwordSalt!,
    );

    if (!isValidPassword) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
    }
  }
}
