import { ValidateFmpIdStrategy, ValidateFmpIdStrategyInput } from '../signInSession.model';

export class SessionSelfOnlyStrategy implements ValidateFmpIdStrategy {
  isValidFmpId({ selfId, targetId }: ValidateFmpIdStrategyInput): boolean {
    const isSelf = selfId === targetId;

    return isSelf;
  }
}
