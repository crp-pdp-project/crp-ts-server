import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IPatientRelativesRepository } from 'src/app/repositories/database/patientRelatives.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IPatientRelativesInteractor {
  relatives(input: FastifyRequest): Promise<PatientModel | ErrorModel>;
}

export class PatientRelativesInteractor implements IPatientRelativesInteractor {
  constructor(private readonly patientRelatives: IPatientRelativesRepository) {}

  async relatives(input: FastifyRequest): Promise<PatientModel | ErrorModel> {
    try {
      const patientId = this.validateSession(input.session);
      const patient = await this.getPatientRelatives(patientId);
      return new PatientModel(patient);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): PatientDM['id'] {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient.id;
  }

  private async getPatientRelatives(patientId: PatientDM['id']): Promise<PatientDTO> {
    const patientWithRelatives = await this.patientRelatives.execute(patientId);
    if (!patientWithRelatives) {
      throw ErrorModel.notFound(ClientErrorMessages.PATIENT_NOT_FOUND);
    }

    return patientWithRelatives;
  }
}
