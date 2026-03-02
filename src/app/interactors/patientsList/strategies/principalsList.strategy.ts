import type { PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import type { IPatientsListRepository } from 'src/app/repositories/database/patientsList.repository';
import { PatientsListRepository } from 'src/app/repositories/database/patientsList.repository';

import type { IPatientsListStrategy } from '../patientsListinteractor';

export class PrincipalsListStrategy implements IPatientsListStrategy {
  constructor(private readonly patientsList: IPatientsListRepository) {}

  async getPatients(query: PatientsListQueryDTO): Promise<PatientDTO[]> {
    const rawList = await this.patientsList.execute(query.limit, query.search, query.cursor);
    return rawList;
  }
}

export class PrincipalsListStrategyBuilder {
  static build(): PrincipalsListStrategy {
    return new PrincipalsListStrategy(new PatientsListRepository());
  }
}
