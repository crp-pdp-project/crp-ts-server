import type { PatientsListParamsDTO, PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import type { IRelativesListRepository } from 'src/app/repositories/database/relativesList.repository';
import { RelativesListRepository } from 'src/app/repositories/database/relativesList.repository';

import type { IPatientsListStrategy } from '../patientsListinteractor';

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
