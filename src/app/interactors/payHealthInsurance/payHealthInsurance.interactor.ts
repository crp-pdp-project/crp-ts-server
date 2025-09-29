import { PayHealthInsuranceBodyDTO } from 'src/app/entities/dtos/input/payHealthInsurance.input.dto';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  IPayHealthInsuranceRepository,
  PayHealthInsuranceRepository,
} from 'src/app/repositories/rest/payHealthInsurance.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IPayHealthInsuranceInteractor {
  pay(body: PayHealthInsuranceBodyDTO, session: SignInSessionModel): Promise<void>;
}

export class PayHealthInsuranceInteractor implements IPayHealthInsuranceInteractor {
  constructor(
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly payHealthInsurance: IPayHealthInsuranceRepository,
  ) {}

  async pay(body: PayHealthInsuranceBodyDTO, session: SignInSessionModel): Promise<void> {
    const externalPatientModel = await this.searchPatient(session);
    await this.payHealthInsurance.execute(
      {
        purchaseNumber: body.correlative,
        tokenId: body.tokenId,
        commerceCode: body.commerceCode,
        amount: body.amount,
        email: externalPatientModel.email,
      },
      body.contractId,
      body.documents,
    );
  }

  private async searchPatient(session: SignInSessionModel): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });

    const externalPatientModel = new PatientExternalModel(searchResult, session.patient);

    return externalPatientModel;
  }
}

export class PayHealthInsuranceInteractorBuilder {
  static build(): PayHealthInsuranceInteractor {
    return new PayHealthInsuranceInteractor(new SearchPatientRepository(), new PayHealthInsuranceRepository());
  }
}
