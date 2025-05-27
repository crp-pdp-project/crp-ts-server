import { AuthAttemptsDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { IUpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { IUpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';

import { ClientErrorMessages } from '../enums/clientErrorMessages.enum';
import { AuthFlowIdentifier } from '../enums/flowIdentifier.enum';
import { DateHelper } from '../helpers/date.helper';

import { IAuthAttemptConfig } from './config/authAttempt.config';

export interface IAuthAttemptManager {
  validateAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined>;
  handleSuccess(attempt?: AuthAttemptsDTO): Promise<void>;
  handleFailure(documentNumber: AuthAttemptsDM['documentNumber'], attempt?: AuthAttemptsDTO): Promise<void>;
}

export class AuthAttemptManager implements IAuthAttemptManager {
  private readonly flow: AuthFlowIdentifier;
  private readonly maxTries: number;
  private readonly blockExpMinutes: number;
  private readonly tryCountExpMinutes: number;

  constructor(
    private readonly authAttemptConfig: IAuthAttemptConfig,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly upsertTryCount: IUpsertTryCountRepository,
    private readonly updateBlocked: IUpdateBlockedRepository,
    private readonly cleanBlocked: ICleanBlockedRepository,
  ) {
    this.flow = this.authAttemptConfig.flowIdentifier;
    this.maxTries = this.authAttemptConfig.maxTries;
    this.blockExpMinutes = this.authAttemptConfig.blockExpMinutes;
    this.tryCountExpMinutes = this.authAttemptConfig.tryCountExpMinutes;
  }

  async validateAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined> {
    const attempt = await this.fetchAttempt(documentNumber);
    if (attempt?.blockExpiredAt && !DateHelper.checkExpired(attempt.blockExpiredAt)) {
      throw ErrorModel.locked({ detail: ClientErrorMessages.DOCUMENT_BLOCKED });
    }

    return attempt;
  }

  async handleSuccess(attempt?: AuthAttemptsDTO): Promise<void> {
    if (attempt?.id) {
      await this.cleanBlocked.execute(attempt.id);
    }
  }

  async handleFailure(documentNumber: AuthAttemptsDM['documentNumber'], attempt?: AuthAttemptsDTO): Promise<void> {
    const newTryCount = this.calculateTryCount(attempt);

    if (!!attempt?.id && newTryCount >= this.maxTries) {
      const expiresAt = DateHelper.tokenRefreshTime(this.blockExpMinutes);
      await this.updateBlocked.execute(attempt.id, expiresAt);
      throw ErrorModel.locked({ detail: ClientErrorMessages.DOCUMENT_BLOCKED });
    }

    const newAttempt: AuthAttemptsDTO = {
      documentNumber,
      flowIdentifier: this.flow,
      tryCount: newTryCount,
      tryCountExpiredAt: DateHelper.tokenRefreshTime(this.tryCountExpMinutes),
    };

    await this.upsertTryCount.execute(newAttempt);
    throw ErrorModel.unauthorized({ detail: ClientErrorMessages.AUTH_INVALID });
  }

  private calculateTryCount(attempt?: AuthAttemptsDTO): number {
    if (!attempt?.tryCount || !attempt?.tryCountExpiredAt || DateHelper.checkExpired(attempt.tryCountExpiredAt)) {
      return 1;
    }

    return attempt.tryCount + 1;
  }

  private async fetchAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined> {
    return this.getAuthAttempt.execute(documentNumber, this.flow);
  }
}
