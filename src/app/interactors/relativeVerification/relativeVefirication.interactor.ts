import { PatientVerificationBodyDTO } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  GetPatientAccountRepository,
  IGetPatientAccountRepository,
} from 'src/app/repositories/database/getPatientAccount.repository';
import { ISavePatientRepository, SavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import {
  IVerifyRelativeRepository,
  VerifyRelativeRepository,
} from 'src/app/repositories/database/verifyRelative.repository';
import {
  ConfirmPatientRepository,
  IConfirmPatientRepository,
} from 'src/app/repositories/soap/confirmPatient.repository';
import {
  CreatePatientNHCRepository,
  ICreatePatientNHCRepository,
} from 'src/app/repositories/soap/createPatientNHC.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IRelativeVerificationInteractor {
  verify(body: PatientVerificationBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel>;
}

export class RelativeVerificationInteractor implements IRelativeVerificationInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly createPatientNHC: ICreatePatientNHCRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
  ) {}

  async verify(body: PatientVerificationBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel> {
    await this.verifyRelationship(body, session);
    const externalPatientModel = await this.searchPatient(body);
    externalPatientModel.validateExistance();
    await this.confirmPatientCreation(externalPatientModel);
    await this.validateNHCId(externalPatientModel);
    await this.persistPatient(externalPatientModel);

    return externalPatientModel;
  }

  private async searchPatient(body: PatientVerificationBodyDTO): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute(body);
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async confirmPatientCreation(patientExternalModel: PatientExternalModel): Promise<void> {
    const confirmationResult = await this.confirmPatientRepository.execute(patientExternalModel.getRawSearchResult());

    if (confirmationResult.fmpId !== patientExternalModel.fmpId) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.PATIENT_NOT_CREATED });
    }
  }

  private async validateNHCId(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.nhcId) {
      await this.createPatientNHC.execute(patientExternalModel.fmpId!);
      const updatedSearchResult = await this.searchPatientRepository.execute({ fmpId: patientExternalModel.fmpId });
      patientExternalModel.updateModel(updatedSearchResult).validateCenter();
    }
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.hasPersistedPatient()) {
      const { insertId } = await this.savePatientRepository.execute(patientExternalModel.toPersistPatientPayload());
      patientExternalModel.inyectPatientId(Number(insertId));
    }
  }

  private async verifyRelationship(body: PatientVerificationBodyDTO, session: SignInSessionModel): Promise<void> {
    const verifyResult = await this.verifyRelativeRepository.execute(
      session.patient.id,
      body.documentNumber,
      body.documentType,
    );

    if (verifyResult?.id || body.documentNumber === session.patient.documentNumber) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.RELATIVE_EXISTS });
    }
  }
}

export class RelativeVerificationInteractorBuilder {
  static build(): RelativeVerificationInteractor {
    return new RelativeVerificationInteractor(
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new ConfirmPatientRepository(),
      new CreatePatientNHCRepository(),
      new SavePatientRepository(),
      new VerifyRelativeRepository(),
    );
  }
}
