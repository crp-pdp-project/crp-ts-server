import { DateHelper } from 'src/general/helpers/date.helper';

import type { InsuranceDueDTO } from '../../dtos/service/insuranceDue.dto';
import { BaseModel } from '../base.model';

export class InsuranceDueModel extends BaseModel {
  readonly id?: string;
  readonly dueDate?: string;
  readonly isOverdue?: boolean;
  readonly amount?: number;
  readonly lateFee?: number;
  readonly administrativeFee?: number;
  readonly minAmount?: number;
  readonly dueNumber?: number;
  readonly version?: number;

  constructor(insuranceDue: InsuranceDueDTO) {
    super();
    this.id = insuranceDue.id;
    this.dueDate = insuranceDue.dueDate ? DateHelper.toDate('spanishDate', insuranceDue.dueDate) : undefined;
    this.isOverdue = insuranceDue.isOverdue;
    this.amount = insuranceDue.amount;
    this.lateFee = insuranceDue.lateFee;
    this.administrativeFee = insuranceDue.administrativeFee;
    this.minAmount = insuranceDue.minAmount;
    this.dueNumber = insuranceDue.dueNumber ? Number(insuranceDue.dueNumber) : undefined;
    this.version = insuranceDue.version;
  }
}
