import { PatientsListParamsDTO, PatientsListQueryDTO } from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientListModel } from 'src/app/entities/models/patient/patientList.model';
import { PatientsListRepository } from 'src/app/repositories/database/patientsList.repository';
import { RelativesListRepository } from 'src/app/repositories/database/relativesList.repository';
import { VerificationRequestListRepository } from 'src/app/repositories/database/verificationRequestList.repository';

import { PrincipalsListStrategy } from './strategies/principalsList.strategy';
import { RelativesListStrategy } from './strategies/relativesList.strategy';
import { VerificationRequestListStrategy } from './strategies/verificationRequestList.strategy';

export interface IPatientsListStrategy {
  getPatients(query: PatientsListQueryDTO, params: PatientsListParamsDTO): Promise<PatientDTO[]>;
}

export interface IPatientsListInteractor {
  list(query: PatientsListQueryDTO, params: PatientsListParamsDTO): Promise<PatientListModel>;
}

export class PatientsListInteractor implements IPatientsListInteractor {
  constructor(private readonly listPatientsStrategy: IPatientsListStrategy) {}

  async list(query: PatientsListQueryDTO, params: PatientsListParamsDTO): Promise<PatientListModel> {
    const listModel = await this.listPaginatedPatients(query, params);
    return listModel;
  }

  private async listPaginatedPatients(
    query: PatientsListQueryDTO,
    params: PatientsListParamsDTO,
  ): Promise<PatientListModel> {
    const rawList = await this.listPatientsStrategy.getPatients(query, params);
    const listModel = new PatientListModel(rawList, query.limit);

    return listModel;
  }
}

export class PatientsListInteractorBuilder {
  static buildPrincipal(): PatientsListInteractor {
    return new PatientsListInteractor(new PrincipalsListStrategy(new PatientsListRepository()));
  }

  static buildRelative(): PatientsListInteractor {
    return new PatientsListInteractor(new RelativesListStrategy(new RelativesListRepository()));
  }

  static buildVerification(): PatientsListInteractor {
    return new PatientsListInteractor(new VerificationRequestListStrategy(new VerificationRequestListRepository()));
  }
}
