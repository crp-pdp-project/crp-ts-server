import { FastifyRequest } from 'fastify';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IDeletePatientAccountRepository } from 'src/app/repositories/database/deletePatientAccount.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IDeletePatientAccountInteractor {
  delete(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class DeletePatientAccountInteractor implements IDeletePatientAccountInteractor {
  constructor(private readonly deletePatientAccount: IDeletePatientAccountRepository) {}

  async delete(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const accountId = this.validateSession(input.session);
      await this.cleanAccount(accountId);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): AccountDM['id'] {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient.account.id;
  }

  private async cleanAccount(id: AccountDM['id']): Promise<void> {
    await this.deletePatientAccount.execute(id);
  }
}
