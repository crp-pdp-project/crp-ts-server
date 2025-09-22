import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { RelativeVerificationBodyDTO } from 'src/app/entities/dtos/input/relativeVerification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
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
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IRelativeVerificationInteractor {
  verify(body: RelativeVerificationBodyDTO, session: SignInSessionModel): Promise<PatientModel>;
}

export class RelativeVerificationInteractor implements IRelativeVerificationInteractor {
  constructor(
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
  ) {}

  async verify(body: RelativeVerificationBodyDTO, session: SignInSessionModel): Promise<PatientModel> {
    const externalPatientModel = await this.searchPatient(body);
    externalPatientModel.validateCenter();
    await this.confirmPatientCreation(externalPatientModel);
    const relative = await this.persistPatient(externalPatientModel);
    await this.verifyRelationship(session.patient.id, relative.id!);

    return relative;
  }

  private async searchPatient(body: RelativeVerificationBodyDTO): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute(body);
    const existingAccount = await this.getPatientAccountRepository.execute(body.documentType, body.documentNumber);

    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async confirmPatientCreation(patientExternalModel: PatientExternalModel): Promise<void> {
    const confirmationResult = await this.confirmPatientRepository.execute(patientExternalModel.getRawSearchResult());

    if (confirmationResult.fmpId !== patientExternalModel.fmpId) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.UNPROCESSABLE_PATIENT });
    }
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<PatientModel> {
    if (!patientExternalModel.hasPersistedPatient()) {
      const { insertId } = await this.savePatientRepository.execute(patientExternalModel.toPersistPatientPayload());
      patientExternalModel.inyectPatientId(Number(insertId));
    }

    return new PatientModel({ id: patientExternalModel.id });
  }

  private async verifyRelationship(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<void> {
    const verifyResult = await this.verifyRelativeRepository.execute(principalId, relativeId);

    if (verifyResult.id) {
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
      new SavePatientRepository(),
      new VerifyRelativeRepository(),
    );
  }
}
