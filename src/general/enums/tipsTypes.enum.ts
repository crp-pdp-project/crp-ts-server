import { TipDTO } from 'src/app/entities/dtos/service/tip.dto';
import cancelTipsStatic from 'src/general/static/cancelTips.static';
import defaultTipsStatic from 'src/general/static/defaultTips.static';
import payBlockedTipsStatic from 'src/general/static/payBlockedTips.static';
import payDeadlineTipsStatic from 'src/general/static/payDeadlineTips.static';

export enum TipsType {
  CANCEL,
  DEFAULT,
  PAY_DEADLINE,
  PAY_BLOCKED,
}

export class TipsTypeUtils {
  static getTipsByType(type: TipsType): readonly TipDTO[] {
    switch (type) {
      case TipsType.CANCEL:
        return cancelTipsStatic;
      case TipsType.DEFAULT:
        return defaultTipsStatic;
      case TipsType.PAY_DEADLINE:
        return payDeadlineTipsStatic;
      case TipsType.PAY_BLOCKED:
        return payBlockedTipsStatic;
    }
  }
}
