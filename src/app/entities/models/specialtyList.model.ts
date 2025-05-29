import { SpecialtyDTO } from '../dtos/service/specialty.dto';

import { BaseModel } from './base.model';
import { SpecialtyModel } from './specialty.model';

export class SpecialtyListModel extends BaseModel {
  readonly specialties: SpecialtyModel[];

  constructor(specialtiesList: SpecialtyDTO[]) {
    super();

    this.specialties = this.generateSpecialtiesList(specialtiesList);
  }

  private generateSpecialtiesList(specialtiesList: SpecialtyDTO[]): SpecialtyModel[] {
    const sortedSpecialties = [...specialtiesList].sort((a, b) => this.sortByNameAsc(a.name, b.name));
    return sortedSpecialties.map((specialty) => new SpecialtyModel(specialty));
  }

  private sortByNameAsc(nameA = '', nameB = ''): number {
    return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
  }
}
