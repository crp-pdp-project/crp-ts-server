import { ValidateFmpIdStrategy, ValidateFmpIdStrategyInput } from '../signInSession.model';

export class SessionSelfOrVerifiedStrategy implements ValidateFmpIdStrategy {
  isValidFmpId({ selfId, targetId, relatives }: ValidateFmpIdStrategyInput): boolean {
    const isSelf = selfId === targetId;
    const isDependant = relatives?.some((relative) => relative.fmpId === targetId && relative.isVerified) ?? false;

    return isSelf || isDependant;
  }
}
