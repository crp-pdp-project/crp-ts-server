import { PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import {
  IVerificationRequestListRepository,
  VerificationRequestListRepository,
} from 'src/app/repositories/database/verificationRequestList.repository';

import { IPatientsListStrategy } from '../patientsListinteractor';

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
