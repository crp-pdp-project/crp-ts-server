import { FastifyRequest } from 'fastify';

import {
  RecoverPasswordBodyDTO,
  RecoverPasswordBodyDTOSchema,
  RecoverPasswordInputDTO,
} from 'src/app/entities/dtos/input/recoverPassword.input.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientRecoverModel } from 'src/app/entities/models/patientRecover.model';
import { IGetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IRecoverPasswordInteractor {
  recover(input: FastifyRequest<RecoverPasswordInputDTO>): Promise<PatientRecoverModel | ErrorModel>;
}

export class RecoverPasswordInteractor implements IRecoverPasswordInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
  ) {}

  async recover(input: FastifyRequest<RecoverPasswordInputDTO>): Promise<PatientRecoverModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      const patientId = await this.getPatientAccount(body);
      const searchResult = await this.searchPatient(body);

      return new PatientRecoverModel(patientId, searchResult);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(body: RecoverPasswordBodyDTO): RecoverPasswordBodyDTO {
    return RecoverPasswordBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: RecoverPasswordBodyDTO): Promise<number> {
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    if (!existingAccount?.id || !existingAccount?.account) {
      throw ErrorModel.badRequest(ClientErrorMessages.PATIENT_NOT_REGISTERED);
    }

    return existingAccount.id;
  }

  private async searchPatient(body: RecoverPasswordBodyDTO): Promise<PatientExternalDTO> {
    const searchResult = await this.searchPatientRepository.execute(body);

    if (searchResult?.centerId !== process.env.CRP_CENTER_ID) {
      throw ErrorModel.notFound(ClientErrorMessages.PATIENT_NOT_FOUND);
    }
    if (!searchResult.email && !searchResult.phone) {
      throw ErrorModel.unprocessable(ClientErrorMessages.UNPROCESSABLE_PATIENT);
    }

    return searchResult;
  }
}
