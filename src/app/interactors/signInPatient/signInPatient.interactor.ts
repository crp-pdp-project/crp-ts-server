import { FastifyRequest } from 'fastify';

import {
  SignInPatientBodyDTO,
  SignInPatientBodyDTOSchema,
  SignInPatientInputDTO,
} from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export interface ISignInStrategy {
  validateAccount(body: SignInPatientBodyDTO): Promise<AccountDTO>;
}

export interface ISignInPatientInteractor {
  signIn(input: FastifyRequest<SignInPatientInputDTO>): Promise<PatientModel | ErrorModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  constructor(private readonly signInStrategy: ISignInStrategy) {}

  async signIn(input: FastifyRequest<SignInPatientInputDTO>): Promise<PatientModel | ErrorModel> {
    try {
      const body = this.validateInput(input.body);
      const account = await this.signInStrategy.validateAccount(body);

      return new PatientModel(account.patient!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateInput(body: SignInPatientBodyDTO): SignInPatientBodyDTO {
    return SignInPatientBodyDTOSchema.parse(body);
  }
}
