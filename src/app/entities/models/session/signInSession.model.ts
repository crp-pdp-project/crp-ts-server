import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SignInSessionPayloadDTO } from 'src/app/entities/dtos/service/signInSessionPayload.dto';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

import { ErrorModel } from '../error/error.model';
import { PatientModel } from '../patient/patient.model';

import { SessionType } from './session.model';
import { SessionModel } from './session.model';
import { SessionSelfOnlyStrategy } from './strategies/sessionSelfOnly.strategy';
import { SessionSelfOrRelativesStrategy } from './strategies/sessionSelfOrRelatives.strategy';

export type ValidateFmpIdStrategyInput = {
  selfId: PatientDM['fmpId'];
  targetId: PatientDM['fmpId'];
  relatives?: PatientModel[];
};

export interface ValidateFmpIdStrategy {
  isValidFmpId(input: ValidateFmpIdStrategyInput): boolean;
}

export class ValidateFmpIdStrategyFactory {
  private static readonly strategyMap: Partial<Record<ValidationRules, ValidateFmpIdStrategy>> = {
    [ValidationRules.SELF_ONLY]: new SessionSelfOnlyStrategy(),
    [ValidationRules.SELF_OR_RELATIVES]: new SessionSelfOrRelativesStrategy(),
  };

  static getStrategy(rule: ValidationRules): ValidateFmpIdStrategy {
    const strategy = this.strategyMap[rule];
    if (!strategy) {
      throw ErrorModel.notFound({ message: 'FMP Validation rule not found' });
    }

    return strategy;
  }
}

export class SignInSessionModel extends SessionModel {
  readonly type = SessionType.SIGN_IN;
  readonly patient: SignInSessionPayloadDTO['patient'];
  private readonly selfId: PatientDM['fmpId'];
  private relatives?: PatientModel[];

  constructor(session: SessionDTO, payload: SignInSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.selfId = payload.patient.fmpId;
  }

  inyectRelatives(relatives: PatientDTO[]): this {
    this.relatives = this.resolveRelatives(relatives);
    return this;
  }

  validateFmpId(fmpId: PatientDM['fmpId'], rule: ValidationRules): void {
    const strategy = ValidateFmpIdStrategyFactory.getStrategy(rule);
    const isValid = strategy.isValidFmpId({
      selfId: this.selfId,
      targetId: fmpId,
      relatives: this.relatives,
    });

    if (!isValid) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.ID_NOT_VALID });
    }
  }

  private resolveRelatives(relatives: PatientDTO[]): PatientModel[] {
    const filteredRelatives = relatives.filter(Boolean) ?? [];

    return filteredRelatives.map(({ relatives: _, ...rest }) => new PatientModel(rest));
  }
}
