import { FastifyRequest } from 'fastify';

import {
  EnrollPatientBodyDTO,
  EnrollPatientBodyDTOSchema,
  EnrollPatientInputDTO,
} from 'src/app/entities/dtos/input/enrollPatient.input.dto';
import { PatientDTO, PatientDTOSchema } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientEnrollModel } from 'src/app/entities/models/patientEnroll.model';
import { IGetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { ISavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { IConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IEnrollPatientInteractor {
  enroll(input: FastifyRequest<EnrollPatientInputDTO>): Promise<PatientEnrollModel | ErrorModel>;
}

export class EnrollPatientInteractor implements IEnrollPatientInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
  ) {}

  async enroll(input: FastifyRequest<EnrollPatientInputDTO>): Promise<PatientEnrollModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      const existingAccount = await this.getPatientAccount(body);
      const searchResult = await this.searchPatient(body);

      let id = existingAccount?.id ?? 0;
      if (!existingAccount) {
        const patientToSave = this.createPatientDTO(searchResult);
        await this.confirmPatientCreation(searchResult);
        id = await this.persistPatient(patientToSave);
      }

      return new PatientEnrollModel(id, searchResult.email, searchResult.phone);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(body: EnrollPatientBodyDTO): EnrollPatientBodyDTO {
    return EnrollPatientBodyDTOSchema.parse(body);
  }

  private async getPatientAccount(body: EnrollPatientBodyDTO): Promise<PatientDTO | null> {
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    if (existingAccount?.account) {
      throw ErrorModel.badRequest(ClientErrorMessages.PATIENT_REGISTERED);
    }

    return existingAccount;
  }

  private async searchPatient(body: EnrollPatientBodyDTO): Promise<PatientExternalDTO> {
    const searchResult = await this.searchPatientRepository.execute(body);

    if (searchResult?.centerId !== process.env.CRP_CENTER_ID) {
      throw ErrorModel.notFound(ClientErrorMessages.PATIENT_NOT_FOUND);
    }
    if (!searchResult.email && !searchResult.phone) {
      throw ErrorModel.unprocessable(ClientErrorMessages.UNPROCESSABLE_PATIENT);
    }

    return searchResult;
  }

  private createPatientDTO(searchResult: PatientExternalDTO): PatientDTO {
    const patientToSave: PatientDTO = {
      fmpId: searchResult.fmpId,
      nhcId: searchResult.nhcId,
      firstName: searchResult.firstName,
      lastName: searchResult.lastName,
      secondLastName: searchResult.secondLastName,
      birthDate: searchResult.birthDate,
      documentNumber: searchResult.documentNumber,
      documentType: searchResult.documentType,
    };

    return PatientDTOSchema.parse(patientToSave);
  }

  private async confirmPatientCreation(searchResult: PatientExternalDTO): Promise<void> {
    const confirmationResult = await this.confirmPatientRepository.execute(searchResult);

    if (confirmationResult.fmpId !== searchResult.fmpId) {
      throw ErrorModel.badRequest();
    }
  }

  private async persistPatient(patientToSave: PatientDTO): Promise<number> {
    const { insertId } = await this.savePatientRepository.execute(patientToSave);
    return Number(insertId);
  }
}
