import { FastifyRequest } from 'fastify';

import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientProfileModel } from 'src/app/entities/models/patientProfile.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IPatientProfileInteractor {
  profile(input: FastifyRequest): Promise<PatientProfileModel | ErrorModel>;
}

export class PatientProfileInteractor implements IPatientProfileInteractor {
  constructor(private readonly searchPatientRepository: ISearchPatientRepository) {}

  async profile(input: FastifyRequest): Promise<PatientProfileModel | ErrorModel> {
    try {
      const patient = this.validateSession(input.session);
      const searchResult = await this.searchPatient({ fmpId: patient.fmpId });

      return new PatientProfileModel(patient, searchResult);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): PatientModel {
    if (!session) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient!;
  }

  private async searchPatient(searchPayload: PatientDTO): Promise<PatientExternalDTO> {
    const searchResult = await this.searchPatientRepository.execute(searchPayload);

    if (searchResult?.centerId !== process.env.CRP_CENTER_ID) {
      throw ErrorModel.notFound(ClientErrorMessages.PATIENT_NOT_FOUND);
    }

    return searchResult;
  }
}
