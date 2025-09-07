import { AuthAttemptDTO } from 'src/app/entities/dtos/service/authAttempt.dto';
import {
  AuthAttemptEnroll,
  AuthAttemptRecover,
  AuthAttemptSignIn,
  IAuthAttemptConfig,
} from 'src/app/entities/models/authAttempt/config/authAttempt.config';
import { BaseModel } from 'src/app/entities/models/base.model';
import { DateHelper } from 'src/general/helpers/date.helper';

import { ErrorModel } from '../error/error.model';

type StrictAuthAttemptDTO = Omit<AuthAttemptDTO, 'documentNumber'> & {
  documentNumber: NonNullable<AuthAttemptDTO['documentNumber']>;
};

export enum AuthFlowIdentifier {
  SIGN_IN = 'signIn',
  RECOVER = 'recover',
  ENROLL = 'enroll',
}

export class AttemptConfigFactory {
  private static configs: Record<AuthFlowIdentifier, new () => IAuthAttemptConfig> = {
    [AuthFlowIdentifier.ENROLL]: AuthAttemptEnroll,
    [AuthFlowIdentifier.RECOVER]: AuthAttemptRecover,
    [AuthFlowIdentifier.SIGN_IN]: AuthAttemptSignIn,
  };

  static getConfig(flowIdentifier: AuthFlowIdentifier): IAuthAttemptConfig {
    const Config = this.configs[flowIdentifier];
    return new Config();
  }
}

export class AuthAttemptModel extends BaseModel {
  readonly id?: number;
  readonly documentNumber: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly flowIdentifier: AuthFlowIdentifier;
  readonly authAttemptConfig: IAuthAttemptConfig;

  #blockExpiresAt?: string;
  #tryCount: number;
  #tryCountExpiresAt?: string;

  constructor(attempt: StrictAuthAttemptDTO, flowIdentifier: AuthFlowIdentifier) {
    super();

    this.id = attempt.id;
    this.documentNumber = attempt.documentNumber;
    this.#blockExpiresAt = attempt.blockExpiresAt ?? undefined;
    this.#tryCount = attempt.tryCount ?? 0;
    this.#tryCountExpiresAt = attempt.tryCountExpiresAt ?? undefined;
    this.createdAt = attempt.createdAt;
    this.updatedAt = attempt.updatedAt;
    this.flowIdentifier = flowIdentifier;
    this.authAttemptConfig = AttemptConfigFactory.getConfig(flowIdentifier);
  }

  get tryCount(): number {
    return this.#tryCount;
  }

  get blockExpiresAt(): string | undefined {
    return this.#blockExpiresAt;
  }

  get tryCountExpiresAt(): string | undefined {
    return this.#tryCountExpiresAt;
  }

  validateAttempt(): void {
    if (this.isBlocked()) {
      throw ErrorModel.locked({ detail: this.authAttemptConfig.blockErrorMessage });
    }
  }

  isBlockedAfterFailure(): boolean {
    this.refreshState();

    return this.isBlocked();
  }

  private isBlocked(): boolean {
    return !!this.#blockExpiresAt && !DateHelper.checkExpired(this.#blockExpiresAt);
  }

  private refreshState(): void {
    if (!this.#tryCountExpiresAt || DateHelper.checkExpired(this.#tryCountExpiresAt)) {
      this.#tryCount = 0;
    }

    this.#tryCount += 1;
    this.#tryCountExpiresAt = DateHelper.addMinutes(this.authAttemptConfig.tryCountExpMinutes, 'dbDateTime');

    if (this.#tryCount >= this.authAttemptConfig.maxTries) {
      this.#blockExpiresAt = DateHelper.addMinutes(this.authAttemptConfig.blockExpMinutes, 'dbDateTime');
    }
  }
}
