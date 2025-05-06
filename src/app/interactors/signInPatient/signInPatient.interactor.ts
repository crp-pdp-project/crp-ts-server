import { FastifyRequest } from 'fastify';

import { SignInBiometricInputDTO } from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { SignInPatientBodyDTO, SignInPatientInputDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { ICleanAccountBlockedRepository } from 'src/app/repositories/database/cleanAccountBlocked.repository';
import { IUpdateAccountBlockedRepository } from 'src/app/repositories/database/updateAccountBlocked.repository';
import { IUpdateAccountTryCountRepository } from 'src/app/repositories/database/updateAccountTryCount.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export interface ISignInStrategy {
  validateAccount(
    body: SignInPatientBodyDTO | SignInBiometricInputDTO,
  ): Promise<{ account: AccountDTO; isValidPassword: boolean }>;
}

export interface ISignInPatientInteractor {
  signIn(
    input: FastifyRequest<SignInPatientInputDTO> | FastifyRequest<SignInBiometricInputDTO>,
  ): Promise<PatientModel | ErrorModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  private readonly maxTries: number = Number(process.env.LOGIN_TRY_COUNT ?? 3);
  private readonly blockMinutes: number = Number(process.env.LOGIN_BLOCK_TIME ?? 60);

  constructor(
    private readonly signInStrategy: ISignInStrategy,
    private readonly updateTryCount: IUpdateAccountTryCountRepository,
    private readonly updateBlocked: IUpdateAccountBlockedRepository,
    private readonly cleanBlocked: ICleanAccountBlockedRepository,
  ) {}

  async signIn(
    input: FastifyRequest<SignInPatientInputDTO> | FastifyRequest<SignInBiometricInputDTO>,
  ): Promise<PatientModel | ErrorModel> {
    try {
      const { account, isValidPassword } = await this.signInStrategy.validateAccount(input.body);
      this.checkBlocked(account);
      if (isValidPassword) {
        await this.handleSuccess(account);
      } else {
        await this.handleFailure(account);
      }

      return new PatientModel(account.patient!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private checkBlocked(account: AccountDTO): void {
    if (account.blockExpiredAt && !DateHelper.checkExpired(account.blockExpiredAt)) {
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_BLOCKED);
    }
  }

  private async handleSuccess(account: AccountDTO): Promise<void> {
    await this.cleanBlocked.execute(account.id!);
  }

  private async handleFailure(account: AccountDTO): Promise<void> {
    if ((account.tryCount ?? 0) >= this.maxTries) {
      const expiresAt = DateHelper.tokenRefreshTime(this.blockMinutes);
      await this.updateBlocked.execute(account.id!, expiresAt);
      throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_BLOCKED);
    }

    await this.updateTryCount.execute(account.id!, (account.tryCount ?? 0) + 1);
    throw ErrorModel.badRequest(ClientErrorMessages.SIGN_IN_INVALID);
  }
}
