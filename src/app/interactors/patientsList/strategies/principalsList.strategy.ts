import { PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { IPatientsListRepository } from 'src/app/repositories/database/patientsList.repository';

import { IPatientsListStrategy } from '../patientsListinteractor';

export class PrincipalsListStrategy implements IPatientsListStrategy {
  constructor(private readonly patientsList: IPatientsListRepository) {}

  async getPatients(query: PatientsListQueryDTO): Promise<PatientDTO[]> {
    const rawList = await this.patientsList.execute(query.limit, query.search, query.cursor);
    return rawList;
  }
}
