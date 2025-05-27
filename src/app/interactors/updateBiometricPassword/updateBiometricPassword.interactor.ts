import { FastifyRequest } from 'fastify';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import {
  UpdateBiometricPasswordBodyDTO,
  UpdateBiometricPasswordBodyDTOSchema,
  UpdateBiometricPasswordInputDTO,
} from 'src/app/entities/dtos/input/updateBiometricPassword.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { ISaveBiometricPasswordRepository } from 'src/app/repositories/database/saveBiometricPassword.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager, PasswordHashResult } from 'src/general/managers/encryption.manager';

export interface IUpdateBiometricPasswordInteractor {
  update(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class UpdateBiometricPasswordInteractor implements IUpdateBiometricPasswordInteractor {
  constructor(
    private readonly saveBiometricPassowrd: ISaveBiometricPasswordRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async update(input: FastifyRequest<UpdateBiometricPasswordInputDTO>): Promise<void | ErrorModel> {
    try {
      const accountId = this.validateSession(input.session);
      const body = this.validateInput(input.body);
      const { hash, salt } = await this.generatePassword(body.password);
      await this.persistPassword(accountId, {
        biometricHash: hash,
        biometricSalt: salt,
      });
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): AccountDM['id'] {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session.patient.account.id;
  }

  private validateInput(body: UpdateBiometricPasswordBodyDTO): UpdateBiometricPasswordBodyDTO {
    return UpdateBiometricPasswordBodyDTOSchema.parse(body);
  }

  private async generatePassword(password: string): Promise<PasswordHashResult> {
    return this.encryptionManager.hashPassword(password);
  }
  private async persistPassword(id: AccountDM['id'], account: AccountDTO): Promise<void> {
    await this.saveBiometricPassowrd.execute(id, account);
  }
}
