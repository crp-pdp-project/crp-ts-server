import { FastifyRequest } from 'fastify';

import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { SpecialtyListModel } from 'src/app/entities/models/specialtyList.model';
import { IGetSpecialtiesRepository } from 'src/app/repositories/soap/getSpecialties.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ISpecialtiesListInteractor {
  list(input: FastifyRequest): Promise<SpecialtyListModel | ErrorModel>;
}

export class SpecialtiesListInteractor implements ISpecialtiesListInteractor {
  constructor(private readonly getSpecialties: IGetSpecialtiesRepository) {}

  async list(input: FastifyRequest): Promise<SpecialtyListModel | ErrorModel> {
    try {
      this.validateSession(input.session);
      const specialtiesList = await this.getSpecialtiesList();
      return new SpecialtyListModel(specialtiesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): void {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }
  }

  private async getSpecialtiesList(): Promise<SpecialtyDTO[]> {
    const specialtiesList = await this.getSpecialties.execute();

    return specialtiesList;
  }
}
