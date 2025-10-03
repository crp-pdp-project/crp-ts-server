import { GuaranteeLetterStates, GuaranteeLetterStatesMapper } from 'src/general/enums/guaranteeLetterState.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

import { GuaranteeLetterDTO } from '../../dtos/service/guaranteeLetter.dto';
import { BaseModel } from '../base.model';

export class GuaranteeLetterModel extends BaseModel {
  readonly letterNumber?: string;
  readonly referenceNumber?: string | null;
  readonly service?: string;
  readonly insurance?: string;
  readonly procedureType?: string;
  readonly coveredAmount?: number;
  readonly status?: GuaranteeLetterStates;
  readonly rejectReason?: string | null;
  readonly notes?: string | null;
  readonly procedure?: string | null;

  constructor(guaranteeLetter: GuaranteeLetterDTO) {
    super();

    this.letterNumber = guaranteeLetter.letterNumber;
    this.referenceNumber = guaranteeLetter.referenceNumber;
    this.service = TextHelper.titleCase(guaranteeLetter.service);
    this.insurance = TextHelper.titleCase(guaranteeLetter.insurance);
    this.procedureType = TextHelper.titleCase(guaranteeLetter.procedureType);
    this.coveredAmount = guaranteeLetter.coveredAmount;
    this.status = guaranteeLetter.status
      ? GuaranteeLetterStatesMapper.getLetterState(guaranteeLetter.status)
      : undefined;
    this.rejectReason =
      guaranteeLetter.rejectReason != null
        ? TextHelper.titleCase(guaranteeLetter.rejectReason)
        : guaranteeLetter.rejectReason;
    this.notes = guaranteeLetter.notes != null ? TextHelper.titleCase(guaranteeLetter.notes) : guaranteeLetter.notes;
    this.procedure =
      guaranteeLetter.procedure != null ? TextHelper.titleCase(guaranteeLetter.procedure) : guaranteeLetter.procedure;
  }
}
