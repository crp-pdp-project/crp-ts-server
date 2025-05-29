import { AuthAttemptsDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { IUpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { IUpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';

import { DateHelper } from '../helpers/date.helper';

import { IAuthAttemptConfig } from './config/authAttempt.config';

export interface IAuthAttemptManager {
  validateAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined>;
  handleSuccess(documentNumber: AuthAttemptsDM['documentNumber']): Promise<void>;
  handleFailure(documentNumber: AuthAttemptsDM['documentNumber'], attempt?: AuthAttemptsDTO): Promise<void>;
}

export class AuthAttemptManager implements IAuthAttemptManager {
  constructor(
    private readonly authAttemptConfig: IAuthAttemptConfig,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly upsertTryCount: IUpsertTryCountRepository,
    private readonly updateBlocked: IUpdateBlockedRepository,
    private readonly cleanBlocked: ICleanBlockedRepository,
  ) {}

  async validateAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined> {
    const attempt = await this.fetchAttempt(documentNumber);
    if (attempt?.blockExpiredAt && !DateHelper.checkExpired(attempt.blockExpiredAt)) {
      throw ErrorModel.locked({ detail: this.authAttemptConfig.blockErrorMessage });
    }

    return attempt;
  }

  async handleSuccess(documentNumber: AuthAttemptsDM['documentNumber']): Promise<void> {
    await this.cleanBlocked.execute(documentNumber);
  }

  async handleFailure(documentNumber: AuthAttemptsDM['documentNumber'], attempt?: AuthAttemptsDTO): Promise<void> {
    const newTryCount = this.calculateTryCount(attempt);

    if (!!attempt?.id && newTryCount >= this.authAttemptConfig.maxTries) {
      const expiresAt = DateHelper.tokenRefreshTime(this.authAttemptConfig.blockExpMinutes);
      await this.updateBlocked.execute(attempt.id, expiresAt);
      throw ErrorModel.locked({ detail: this.authAttemptConfig.blockErrorMessage });
    }

    const newAttempt: AuthAttemptsDTO = {
      documentNumber,
      flowIdentifier: this.authAttemptConfig.flowIdentifier,
      tryCount: newTryCount,
      tryCountExpiredAt: DateHelper.tokenRefreshTime(this.authAttemptConfig.tryCountExpMinutes),
    };

    await this.upsertTryCount.execute(newAttempt);
    throw ErrorModel.unauthorized({ detail: this.authAttemptConfig.tryErrorMessage });
  }

  private calculateTryCount(attempt?: AuthAttemptsDTO): number {
    if (!attempt?.tryCount || !attempt?.tryCountExpiredAt || DateHelper.checkExpired(attempt.tryCountExpiredAt)) {
      return 1;
    }

    return attempt.tryCount + 1;
  }

  private async fetchAttempt(documentNumber: AuthAttemptsDM['documentNumber']): Promise<AuthAttemptsDTO | undefined> {
    return this.getAuthAttempt.execute(documentNumber, this.authAttemptConfig.flowIdentifier);
  }
}
