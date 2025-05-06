import { FastifyRequest } from 'fastify';

import {
  PatientVerificationBodyDTO,
  PatientVerificationBodyDTOSchema,
  PatientVerificationInputDTO,
} from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patientExternal.model';
import { IGetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IPatientVerificationStrategy {
  persisVerification(searchResult: PatientExternalDTO, patient?: PatientDTO | null): Promise<number>;
}

export interface IPatientVerificationInteractor {
  verify(input: FastifyRequest<PatientVerificationInputDTO>): Promise<PatientExternalModel | ErrorModel>;
}

export class PatientVerificationInteractor implements IPatientVerificationInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly verificationStrategy: IPatientVerificationStrategy,
  ) {}

  async verify(input: FastifyRequest<PatientVerificationInputDTO>): Promise<PatientExternalModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      const existingAccount = await this.getPatientAccount(body);
      const searchResult = await this.searchPatient(body);
      const patientId = await this.verificationStrategy.persisVerification(searchResult, existingAccount);

      return new PatientExternalModel(patientId, searchResult);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(body: PatientVerificationBodyDTO): PatientVerificationBodyDTO {
    return PatientVerificationBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: PatientVerificationBodyDTO): Promise<PatientDTO | null> {
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    if (existingAccount?.account) {
      throw ErrorModel.badRequest(ClientErrorMessages.PATIENT_REGISTERED);
    }

    return existingAccount;
  }

  private async searchPatient(body: PatientVerificationBodyDTO): Promise<PatientExternalDTO> {
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
