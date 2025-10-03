import { ErrorModel } from 'src/app/entities/models/error/error.model';

export enum GuaranteeLetterStates {
  APPROVED = 1,
  IN_PROGRESS = 2,
}

export enum GuaranteeLetterTextStates {
  APPROVED = 'APROBADO',
  IN_PROGRESS = 'EN TRÁMITE',
}

export class GuaranteeLetterStatesMapper {
  private static readonly letterStatesMap: Record<GuaranteeLetterTextStates, GuaranteeLetterStates> = {
    [GuaranteeLetterTextStates.APPROVED]: GuaranteeLetterStates.APPROVED,
    [GuaranteeLetterTextStates.IN_PROGRESS]: GuaranteeLetterStates.IN_PROGRESS,
  };
  static getLetterState(state: string): GuaranteeLetterStates {
    if (!(state in this.letterStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid Guarantee Letter state: ${state}` });
    }
    return this.letterStatesMap[state as GuaranteeLetterTextStates];
  }
}
