import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SignInSessionPayloadDTO } from 'src/app/entities/dtos/service/signInSessionPayload.dto';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';
import { PatientModel } from '../patient/patient.model';

import { SessionModel } from './session.model';
import { SessionSelfOnlyStrategy } from './strategies/sessionSelfOnly.strategy';
import { SessionSelfOrDependantsStrategy } from './strategies/sessionSelfOrDependants.strategy';
import { SessionSelfOrRelativesStrategy } from './strategies/sessionSelfOrRelatives.strategy';
import { SessionSelfOrVerifiedStrategy } from './strategies/sessionSelfOrVerified.strategy';

export type ValidateFmpIdStrategyInput = {
  selfId: PatientDM['fmpId'];
  targetId: PatientDM['fmpId'];
  relatives?: PatientModel[];
};

export interface ValidateFmpIdStrategy {
  isValidFmpId(input: ValidateFmpIdStrategyInput): boolean;
}

export enum ValidationRules {
  SELF_ONLY,
  SELF_OR_RELATIVES,
  SELF_OR_VERIFIED,
  SELF_OR_DEPENDANTS,
}

export class ValidateFmpIdStrategyFactory {
  private static readonly strategyMap: Record<ValidationRules, new () => ValidateFmpIdStrategy> = {
    [ValidationRules.SELF_ONLY]: SessionSelfOnlyStrategy,
    [ValidationRules.SELF_OR_RELATIVES]: SessionSelfOrRelativesStrategy,
    [ValidationRules.SELF_OR_VERIFIED]: SessionSelfOrVerifiedStrategy,
    [ValidationRules.SELF_OR_DEPENDANTS]: SessionSelfOrDependantsStrategy,
  };

  static getStrategy(rule: ValidationRules): ValidateFmpIdStrategy {
    const Strategy = this.strategyMap[rule];

    if (!Strategy) {
      throw ErrorModel.notFound({ message: 'FMP Validation rule not found' });
    }

    return new Strategy();
  }
}

export class SignInSessionModel extends SessionModel {
  readonly type = Audiences.SIGN_IN;
  readonly patient: SignInSessionPayloadDTO['patient'];
  private readonly selfId: PatientDM['fmpId'];

  #relatives?: PatientModel[];

  constructor(session: SessionDTO, payload: SignInSessionPayloadDTO) {
    super(session.jti, session.expiresAt);

    this.patient = payload.patient;
    this.selfId = payload.patient.fmpId;
  }

  inyectRelatives(relatives: PatientDTO[]): this {
    this.#relatives = this.resolveRelatives(relatives);

    return this;
  }

  getPatient(fmpId: PatientDM['fmpId']): PatientModel {
    const selectedRelative =
      this.patient.fmpId === fmpId
        ? new PatientModel(this.patient)
        : this.#relatives?.find((relative) => relative.fmpId === fmpId);

    if (!selectedRelative) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.ID_NOT_VALID });
    }

    return selectedRelative;
  }

  isValidFmpId(fmpId: PatientDM['fmpId'], rule: ValidationRules): boolean {
    const strategy = ValidateFmpIdStrategyFactory.getStrategy(rule);
    const isValid = strategy.isValidFmpId({
      selfId: this.selfId,
      targetId: fmpId,
      relatives: this.#relatives,
    });

    return isValid;
  }

  validateFmpId(fmpId: PatientDM['fmpId'], rule: ValidationRules): void {
    const isValid = this.isValidFmpId(fmpId, rule);
    if (!isValid) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.ID_NOT_VALID });
    }
  }

  private resolveRelatives(relatives: PatientDTO[]): PatientModel[] {
    const filteredRelatives = relatives.filter(Boolean) ?? [];

    return filteredRelatives.map(({ relatives: _, ...rest }) => new PatientModel(rest));
  }
}
