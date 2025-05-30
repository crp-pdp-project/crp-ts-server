import { FastifyRequest } from 'fastify';

import {
  CreateEnrolledAccountBodyDTO,
  CreateEnrolledAccountBodyDTOSchema,
  CreateEnrolledAccountInputDTO,
} from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { EnrollSessionModel } from 'src/app/entities/models/enrollSession.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { ISavePatientAccountRepository } from 'src/app/repositories/database/savePatientAccount.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager, PasswordHashResult } from 'src/general/managers/encryption.manager';

export interface ICreateEnrolledAccountInteractor {
  create(input: FastifyRequest<CreateEnrolledAccountInputDTO>): Promise<void | ErrorModel>;
}

export class CreateEnrolledAccountInteractor implements ICreateEnrolledAccountInteractor {
  constructor(
    private readonly savePatientAccount: ISavePatientAccountRepository,
    private readonly cleanSession: ICleanSessionRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async create(input: FastifyRequest<CreateEnrolledAccountInputDTO>): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const body = this.validateInput(input.body);
      const { hash, salt } = await this.generatePassword(body.password);
      await this.persistPassword({
        passwordHash: hash,
        passwordSalt: salt,
        acceptTerms: body.acceptTerms,
        acceptAdvertising: body.acceptAdvertising,
        patientId: session.patient.id,
      });
      await this.endSession(session.jti, session.patient.id);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): EnrollSessionModel {
    if (!(session instanceof EnrollSessionModel) || !session.isValidated) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }

  private validateInput(body: CreateEnrolledAccountBodyDTO): CreateEnrolledAccountBodyDTO {
    return CreateEnrolledAccountBodyDTOSchema.parse(body);
  }

  private async generatePassword(password: string): Promise<PasswordHashResult> {
    return this.encryptionManager.hashPassword(password);
  }
  private async persistPassword(account: AccountDTO): Promise<void> {
    await this.savePatientAccount.execute(account);
  }

  private async endSession(jti: string, patientId: number): Promise<void> {
    await this.cleanSession.execute(jti, patientId);
  }
}
