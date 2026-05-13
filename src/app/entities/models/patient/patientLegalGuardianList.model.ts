import type { PatientLegalGuardianDTO } from '../../dtos/service/patientLegalGuardian.dto';
import { BaseModel } from '../base.model';

import { PatientLegalGuardianModel } from './patientLegalGuardian.model';

export class PatientLegalGuardianListModel extends BaseModel {
  readonly legalGuardians: PatientLegalGuardianModel[];

  constructor(legalGuardians: PatientLegalGuardianDTO[]) {
    super();

    this.legalGuardians = this.generateLegalGuardianList(legalGuardians);
  }

  getLegalGuardian(documentNumber?: string): PatientLegalGuardianModel | undefined {
    return this.legalGuardians.find((legalGuardian) => legalGuardian.documentNumber === documentNumber);
  }

  private generateLegalGuardianList(legalGuardians: PatientLegalGuardianDTO[]): PatientLegalGuardianModel[] {
    return legalGuardians.map((legalGuardian) => new PatientLegalGuardianModel(legalGuardian));
  }
}
