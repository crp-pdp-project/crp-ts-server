import { ValidateFmpIdStrategy, ValidateFmpIdStrategyInput } from '../signInSession.model';

export class SessionSelfOrDependantsStrategy implements ValidateFmpIdStrategy {
  isValidFmpId({ selfId, targetId, relatives }: ValidateFmpIdStrategyInput): boolean {
    const isSelf = selfId === targetId;
    const isDependant =
      relatives?.some(
        (relative) => relative.fmpId === targetId && relative.isVerified && relative.relationship?.isDependant,
      ) ?? false;

    return isSelf || isDependant;
  }
}
