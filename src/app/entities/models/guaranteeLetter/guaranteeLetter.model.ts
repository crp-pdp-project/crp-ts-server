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
  readonly status?: string;
  readonly rejectReason?: string | null;
  readonly notes?: string | null;
  readonly procedure?: string;

  constructor(guaranteeLetter: GuaranteeLetterDTO) {
    super();

    this.letterNumber = guaranteeLetter.letterNumber;
    this.referenceNumber = guaranteeLetter.referenceNumber;
    this.service = TextHelper.titleCase(guaranteeLetter.service);
    this.insurance = TextHelper.titleCase(guaranteeLetter.insurance);
    this.procedureType = TextHelper.titleCase(guaranteeLetter.procedureType);
    this.coveredAmount = guaranteeLetter.coveredAmount;
    this.status = guaranteeLetter.status;
    this.rejectReason =
      guaranteeLetter.rejectReason != null
        ? TextHelper.titleCase(guaranteeLetter.rejectReason)
        : guaranteeLetter.rejectReason;
    this.notes = guaranteeLetter.notes != null ? TextHelper.titleCase(guaranteeLetter.notes) : guaranteeLetter.notes;
    this.procedure = TextHelper.titleCase(guaranteeLetter.procedure);
  }
}
