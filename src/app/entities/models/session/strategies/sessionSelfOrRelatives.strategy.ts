import { ValidateFmpIdStrategy, ValidateFmpIdStrategyInput } from '../signInSession.model';

export class SessionSelfOrRelativesStrategy implements ValidateFmpIdStrategy {
  isValidFmpId({ selfId, targetId, relatives }: ValidateFmpIdStrategyInput): boolean {
    const isSelf = selfId === targetId;
    const isRelative = relatives?.some((relative) => relative.fmpId === targetId) ?? false;

    return isSelf || isRelative;
  }
}
