import { PatientsListParamsDTO, PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import {
  IRelativesListRepository,
  RelativesListRepository,
} from 'src/app/repositories/database/relativesList.repository';

import { IPatientsListStrategy } from '../patientsListinteractor';

export class RelativesListStrategy implements IPatientsListStrategy {
  constructor(private readonly relativesList: IRelativesListRepository) {}

  async getPatients(query: PatientsListQueryDTO, params: PatientsListParamsDTO): Promise<PatientDTO[]> {
    const rawList = await this.relativesList.execute(params.patientId, query.limit, query.search, query.cursor);
    return rawList;
  }
}

export class RelativesListStrategyBuilder {
  static build(): RelativesListStrategy {
    return new RelativesListStrategy(new RelativesListRepository());
  }
}
