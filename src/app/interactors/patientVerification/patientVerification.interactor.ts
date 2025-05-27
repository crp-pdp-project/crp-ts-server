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
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IAuthAttemptManager } from 'src/general/managers/authAttempt.manager';

export interface IPatientVerificationStrategy {
  persistVerification(searchResult: PatientExternalDTO, patient?: PatientDTO): Promise<PatientDTO>;
}

export interface IPatientVerificationInteractor {
  verify(input: FastifyRequest<PatientVerificationInputDTO>): Promise<PatientExternalModel | ErrorModel>;
}

export class PatientVerificationInteractor implements IPatientVerificationInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly verificationStrategy: IPatientVerificationStrategy,
    private readonly authAttemptManager: IAuthAttemptManager,
  ) {}

  async verify(input: FastifyRequest<PatientVerificationInputDTO>): Promise<PatientExternalModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      await this.authAttemptManager.validateAttempt(body.documentNumber);
      const existingAccount = await this.getPatientAccount(body);
      const searchResult = await this.searchPatient(body);
      const patient = await this.verificationStrategy.persistVerification(searchResult, existingAccount);

      return new PatientExternalModel(patient, searchResult);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(body: PatientVerificationBodyDTO): PatientVerificationBodyDTO {
    return PatientVerificationBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: PatientVerificationBodyDTO): Promise<PatientDTO | undefined> {
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    return existingAccount;
  }

  private async searchPatient(body: PatientVerificationBodyDTO): Promise<PatientExternalDTO> {
    const searchResult = await this.searchPatientRepository.execute(body);

    if (searchResult?.centerId !== CRPConstants.CENTER_ID) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }
    if (!searchResult.email && !searchResult.phone) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.UNPROCESSABLE_PATIENT });
    }

    return searchResult;
  }
}
