import { BaseModel } from 'src/app/entities/models/base.model';
import { HealthInsuranceConstants } from 'src/general/contants/healthInsurance.constants';
import { TextHelper } from 'src/general/helpers/text.helper';

import { InsuranceDueDTO } from '../../dtos/service/insuranceDue.dto';
import { InsuredPatientDTO } from '../../dtos/service/insuredPatient.dto';
import { InsuredPatientDuesDTO } from '../../dtos/service/insuredPatientDues.dto';

import { InsuranceDueSectionModel } from './insuranceDueSection.model';

export class InsuredPatientDuesModel extends BaseModel {
  readonly contractId: string;
  readonly name?: string;
  readonly sections: InsuranceDueSectionModel[];

  constructor(dues: InsuredPatientDuesDTO[], insured: InsuredPatientDTO, contractId: string) {
    super();

    this.contractId = contractId;
    this.name = TextHelper.titleCase(insured.name);
    this.sections = this.resolveSections(dues);
  }

  private resolveSections(patientDues: InsuredPatientDuesDTO[]): InsuranceDueSectionModel[] {
    const dues = patientDues.flatMap((dueGroup) => {
      const groupDues = dueGroup.dueList ?? [];
      return groupDues.map((due) => ({ ...due, version: dueGroup.versionNumber }));
    });

    const specialDues: InsuranceDueDTO[] = [];
    const regularDues: InsuranceDueDTO[] = [];

    dues.forEach((due) => {
      if (Number(due.dueNumber) >= 13) specialDues.push(due);
      else regularDues.push(due);
    });

    return [
      new InsuranceDueSectionModel({ title: HealthInsuranceConstants.SPECIAL_TITLE, dues: specialDues }),
      new InsuranceDueSectionModel({ title: HealthInsuranceConstants.REGULAR_TITLE, dues: regularDues }),
    ];
  }
}
