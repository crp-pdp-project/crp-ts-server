import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { CreatePatientBodyDTO } from 'src/app/entities/dtos/input/createPatient.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IGetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import { GetPatientAccountRepository } from 'src/app/repositories/database/getPatientAccount.repository';
import type { IUpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import { UpsertPatientRepository } from 'src/app/repositories/database/upsertPatient.repository';
import type { IVerifyRelativeRepository } from 'src/app/repositories/database/verifyRelative.repository';
import { VerifyRelativeRepository } from 'src/app/repositories/database/verifyRelative.repository';
import type { IConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import type { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ICreateRelativeInformationInteractor {
  create(body: CreatePatientBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel>;
}

export class CreateRelativeInformationInteractor implements ICreateRelativeInformationInteractor {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly upsertPatientRepository: IUpsertPatientRepository,
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
  ) {}

  async create(body: CreatePatientBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel> {
    await this.verifyRelationship(body, session);
    const rawPatientExternalModel = new PatientExternalModel(body);
    const legalGuardian = await this.searchLegalGuardian(rawPatientExternalModel, session);
    const newFmpId = await this.patientCreation(rawPatientExternalModel, legalGuardian);
    const patientExternalModel = await this.searchNewPatient(newFmpId, body.documentNumber);
    await this.persistPatient(patientExternalModel);

    return patientExternalModel;
  }

  private async patientCreation(
    rawPatientExternalModel: PatientExternalModel,
    legalGuardian?: PatientExternalModel,
  ): Promise<PatientDM['fmpId']> {
    const creationResult = await this.confirmPatientRepository.execute(
      rawPatientExternalModel.getRawSearchResult(),
      legalGuardian?.getRawSearchResult(),
    );

    return creationResult.fmpId;
  }

  private async searchNewPatient(
    fmpId: PatientDM['fmpId'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const existingAccount = await this.getPatientAccountRepository.execute(documentNumber);
    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);
    externalPatientModel.validateExistance();

    return externalPatientModel;
  }

  private async searchLegalGuardian(
    patientExternalModel: PatientExternalModel,
    session: SignInSessionModel,
  ): Promise<PatientExternalModel | undefined> {
    if (!patientExternalModel.isMinor()) {
      return;
    }

    const legalGuardian = session.getCurrentPatient();
    const searchResult = await this.searchPatientRepository.execute({ fmpId: legalGuardian.fmpId });

    const externalPatientGuardianModel = new PatientExternalModel(searchResult);
    externalPatientGuardianModel.validateExistance();

    return externalPatientGuardianModel;
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    const { insertId } = await this.upsertPatientRepository.execute(patientExternalModel.toPersistPatientPayload());
    patientExternalModel.inyectPatientId(Number(insertId));
  }

  private async verifyRelationship(body: CreatePatientBodyDTO, session: SignInSessionModel): Promise<void> {
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

export class CreateRelativeInformationInteractorBuilder {
  static build(): CreateRelativeInformationInteractor {
    return new CreateRelativeInformationInteractor(
      new ConfirmPatientRepository(),
      new GetPatientAccountRepository(),
      new SearchPatientRepository(),
      new UpsertPatientRepository(),
      new VerifyRelativeRepository(),
    );
  }
}
