import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ICleanAccountBlockedRepository } from 'src/app/repositories/database/cleanAccountBlocked.repository';
import { IUpdateAccountBlockedRepository } from 'src/app/repositories/database/updateAccountBlocked.repository';
import { IUpdateAccountTryCountRepository } from 'src/app/repositories/database/updateAccountTryCount.repository';

import { ClientErrorMessages } from '../enums/clientErrorMessages.enum';
import { DateHelper } from '../helpers/date.helper';

export interface ISignInManager {
  checkBlocked(account: AccountDTO): void;
  handleSuccess(account: AccountDTO): Promise<void>;
  handleFailure(account: AccountDTO): Promise<void>;
}

export class SignInManager implements ISignInManager {
  private readonly maxTries = Number(process.env.LOGIN_TRY_COUNT ?? 3);
  private readonly blockMinutes = Number(process.env.LOGIN_BLOCK_TIME ?? 60);

  constructor(
    private readonly updateTryCount: IUpdateAccountTryCountRepository,
    private readonly updateBlocked: IUpdateAccountBlockedRepository,
    private readonly cleanBlocked: ICleanAccountBlockedRepository,
  ) {}

  checkBlocked(account: AccountDTO): void {
    if (account.blockExpiredAt && !DateHelper.checkExpired(account.blockExpiredAt)) {
      throw ErrorModel.locked(ClientErrorMessages.SIGN_IN_BLOCKED);
    }
  }

  async handleSuccess(account: AccountDTO): Promise<void> {
    await this.cleanBlocked.execute(account.id!);
  }

  async handleFailure(account: AccountDTO): Promise<void> {
    const currentTryCount = account.tryCount ?? 0;

    if (currentTryCount + 1 >= this.maxTries) {
      const expiresAt = DateHelper.tokenRefreshTime(this.blockMinutes);
      await this.updateBlocked.execute(account.id!, expiresAt);
      throw ErrorModel.locked(ClientErrorMessages.SIGN_IN_BLOCKED);
    }

    await this.updateTryCount.execute(account.id!, currentTryCount + 1);
    throw ErrorModel.unauthorized(ClientErrorMessages.SIGN_IN_INVALID);
  }
}
