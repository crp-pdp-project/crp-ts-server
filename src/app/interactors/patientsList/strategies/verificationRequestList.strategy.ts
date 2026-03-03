import type { PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import type { IVerificationRequestListRepository } from 'src/app/repositories/database/verificationRequestList.repository';
import { VerificationRequestListRepository } from 'src/app/repositories/database/verificationRequestList.repository';

import type { IPatientsListStrategy } from '../patientsListinteractor';

export class VerificationRequestListStrategy implements IPatientsListStrategy {
  constructor(private readonly verificationList: IVerificationRequestListRepository) {}

  async getPatients(query: PatientsListQueryDTO): Promise<PatientDTO[]> {
    const rawList = await this.verificationList.execute(query.limit, query.search, query.cursor);
    return rawList;
  }
}

export class VerificationRequestListStrategyBuilder {
  static build(): VerificationRequestListStrategy {
    return new VerificationRequestListStrategy(new VerificationRequestListRepository());
  }
}
