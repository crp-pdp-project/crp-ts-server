import { FastifyRequest } from 'fastify';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import {
  UpdatePatientPasswordBodyDTO,
  UpdatePatientPasswordBodyDTOSchema,
  UpdatePatientPasswordInputDTO,
} from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { RecoverSessionModel } from 'src/app/entities/models/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { ICleanSessionRepository } from 'src/app/repositories/database/cleanSession.repository';
import { IUpdatePatientPasswordRepository } from 'src/app/repositories/database/updatePatientPassword.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IEncryptionManager, PasswordHashResult } from 'src/general/managers/encryption.manager';

export interface IUpdatePatientPasswordInteractor {
  update(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class UpdatePatientPasswordInteractor implements IUpdatePatientPasswordInteractor {
  constructor(
    private readonly updatePatientPassowrd: IUpdatePatientPasswordRepository,
    private readonly cleanSession: ICleanSessionRepository,
    private readonly encryptionManager: IEncryptionManager,
  ) {}

  async update(input: FastifyRequest<UpdatePatientPasswordInputDTO>): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const body = this.validateInput(input.body);
      const { hash, salt } = await this.generatePassword(body.password);
      await this.persistPassword(session.patient.account.id, {
        passwordHash: hash,
        passwordSalt: salt,
      });
      await this.endSession(session.jti, session.patient.id);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): RecoverSessionModel {
    if (!(session instanceof RecoverSessionModel) || !session.isValidated) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }

  private validateInput(body: UpdatePatientPasswordBodyDTO): UpdatePatientPasswordBodyDTO {
    return UpdatePatientPasswordBodyDTOSchema.parse(body);
  }

  private async generatePassword(password: string): Promise<PasswordHashResult> {
    return this.encryptionManager.hashPassword(password);
  }
  private async persistPassword(id: AccountDM['id'], account: AccountDTO): Promise<void> {
    await this.updatePatientPassowrd.execute(id, account);
  }

  private async endSession(jti: SessionDM['jti'], patientId: PatientDM['id']): Promise<void> {
    await this.cleanSession.execute(jti, patientId);
  }
}
