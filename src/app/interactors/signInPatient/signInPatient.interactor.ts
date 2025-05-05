import { FastifyRequest } from 'fastify';

import { SignInBiometricInputDTO } from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { SignInPatientBodyDTO, SignInPatientInputDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export interface ISignInStrategy {
  validateAccount(body: SignInPatientBodyDTO | SignInBiometricInputDTO): Promise<AccountDTO>;
}

export interface ISignInPatientInteractor {
  signIn(
    input: FastifyRequest<SignInPatientInputDTO> | FastifyRequest<SignInBiometricInputDTO>,
  ): Promise<PatientModel | ErrorModel>;
}

export class SignInPatientInteractor implements ISignInPatientInteractor {
  constructor(private readonly signInStrategy: ISignInStrategy) {}

  async signIn(
    input: FastifyRequest<SignInPatientInputDTO> | FastifyRequest<SignInBiometricInputDTO>,
  ): Promise<PatientModel | ErrorModel> {
    try {
      const account = await this.signInStrategy.validateAccount(input.body);

      return new PatientModel(account.patient!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }
}
