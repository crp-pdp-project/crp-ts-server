import { FastifyRequest } from 'fastify';

import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SpecialtyModel } from 'src/app/entities/models/specialty.model';
import { IGetSpecialtiesRepository } from 'src/app/repositories/soap/getSpecialties.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface ISpecialtiesListInteractor {
  list(input: FastifyRequest): Promise<SpecialtyModel[] | ErrorModel>;
}

export class SpecialtiesListInteractor implements ISpecialtiesListInteractor {
  constructor(private readonly getSpecialties: IGetSpecialtiesRepository) {}

  async list(input: FastifyRequest): Promise<SpecialtyModel[] | ErrorModel> {
    try {
      this.validateSession(input.session);
      const specialtiesList = await this.getSpecialtiesList();
      return this.generateModels(specialtiesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): void {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getSpecialtiesList(): Promise<SpecialtyDTO[]> {
    const specialtiesList = await this.getSpecialties.execute();

    return specialtiesList;
  }

  private generateModels(specialtiesList: SpecialtyDTO[]): SpecialtyModel[] {
    const models = specialtiesList.map((specialty) => new SpecialtyModel(specialty));
    return models;
  }
}
