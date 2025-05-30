import { FastifyRequest } from 'fastify';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { ICleanBiometricPasswordRepository } from 'src/app/repositories/database/cleanBiometricPassword.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IDeleteBiometricPasswordInteractor {
  delete(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class DeleteBiometricPasswordInteractor implements IDeleteBiometricPasswordInteractor {
  constructor(private readonly cleanBiometricPassword: ICleanBiometricPasswordRepository) {}

  async delete(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const accountId = this.validateSession(input.session);
      await this.deletePassword(accountId);
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

  private async deletePassword(id: AccountDM['id']): Promise<void> {
    await this.cleanBiometricPassword.execute(id);
  }
}
