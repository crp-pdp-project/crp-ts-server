import { PatientsListParamsDTO, PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { IRelativesListRepository } from 'src/app/repositories/database/relativesList.repository';

import { IPatientsListStrategy } from '../patientsListinteractor';

export class RelativesListStrategy implements IPatientsListStrategy {
  constructor(private readonly relativesList: IRelativesListRepository) {}

  async getPatients(query: PatientsListQueryDTO, params: PatientsListParamsDTO): Promise<PatientDTO[]> {
    const rawList = await this.relativesList.execute(params.id, query.limit, query.search, query.cursor);
    return rawList;
  }
}
