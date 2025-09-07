import { SpecialtyListModel } from 'src/app/entities/models/specialty/specialtyList.model';
import {
  GetSpecialtiesRepository,
  IGetSpecialtiesRepository,
} from 'src/app/repositories/soap/getSpecialties.repository';

export interface ISpecialtiesListInteractor {
  list(): Promise<SpecialtyListModel>;
}

export class SpecialtiesListInteractor implements ISpecialtiesListInteractor {
  constructor(private readonly getSpecialties: IGetSpecialtiesRepository) {}

  async list(): Promise<SpecialtyListModel> {
    const specialtiesList = await this.getSpecialties.execute();
    return new SpecialtyListModel(specialtiesList);
  }
}

export class SpecialtiesListInteractorBuilder {
  static build(): SpecialtiesListInteractor {
    return new SpecialtiesListInteractor(new GetSpecialtiesRepository());
  }
}
