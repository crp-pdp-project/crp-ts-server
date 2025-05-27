import { FastifyRequest } from 'fastify';

import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export interface ISignInStrategy {
  signIn(body: unknown): Promise<PatientDTO>;
}

export interface ISignInPatientInteractor {
  signIn(input: FastifyRequest): Promise<PatientModel | ErrorModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  constructor(private readonly signInStrategy: ISignInStrategy) {}

  async signIn(input: FastifyRequest): Promise<PatientModel | ErrorModel> {
    try {
      const patient = await this.signInStrategy.signIn(input.body);

      return new PatientModel(patient);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }
}
