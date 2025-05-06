import { FastifyRequest } from 'fastify';

import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { InsuranceModel } from 'src/app/entities/models/insurance.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IGetInsurancesRepository } from 'src/app/repositories/soap/getInsurances.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IInsurancesListInteractor {
  list(input: FastifyRequest): Promise<InsuranceModel[] | ErrorModel>;
}

export class InsurancesListInteractor implements IInsurancesListInteractor {
  constructor(private readonly getInsurances: IGetInsurancesRepository) {}

  async list(input: FastifyRequest): Promise<InsuranceModel[] | ErrorModel> {
    try {
      this.validateSession(input.session);
      const insurancesList = await this.getInsurancesList();
      return this.generateModels(insurancesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): void {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getInsurancesList(): Promise<InsuranceDTO[]> {
    const insurancesList = await this.getInsurances.execute();

    return insurancesList;
  }

  private generateModels(insurancesList: InsuranceDTO[]): InsuranceModel[] {
    const models = insurancesList.map((insurance) => new InsuranceModel(insurance));
    return models;
  }
}
