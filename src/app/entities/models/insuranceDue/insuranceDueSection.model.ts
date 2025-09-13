import { InsuranceDueDTO } from '../../dtos/service/insuranceDue.dto';
import { InsuranceDueSectionDTO } from '../../dtos/service/insuranceDueSection.dto';
import { BaseModel } from '../base.model';

import { InsuranceDueModel } from './insuranceDue.model';

export class InsuranceDueSectionModel extends BaseModel {
  readonly title?: string;
  readonly dues?: InsuranceDueModel[];

  constructor(section: InsuranceDueSectionDTO) {
    super();

    this.title = section.title;
    this.dues = section.dues ? this.resolveDues(section.dues) : undefined;
  }

  private resolveDues(dues: InsuranceDueDTO[]): InsuranceDueModel[] {
    const dueModels: InsuranceDueModel[] = dues.map((due) => new InsuranceDueModel(due));
    return dueModels.sort(this.sortByVersionAndDueNumber);
  }

  private sortByVersionAndDueNumber(this: void, a: InsuranceDueModel, b: InsuranceDueModel): number {
    const aVersion = a.version ?? 0;
    const bVersion = b.version ?? 0;
    if (aVersion !== bVersion) return aVersion - bVersion;

    const aDueNumber = a.dueNumber ?? 0;
    const bDueNumber = b.dueNumber ?? 0;
    return aDueNumber - bDueNumber;
  }
}
