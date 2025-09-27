import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { CreateRelativeInformationBodyDTO } from 'src/app/entities/dtos/input/createRelativeInformation.input.dto';
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
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ICreateRelativeInformationInteractor {
  create(body: CreateRelativeInformationBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel>;
}

export class CreateRelativeInformationInteractor implements ICreateRelativeInformationInteractor {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly getPatientAccountRepository: IGetPatientAccountRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
  ) {}

  async create(body: CreateRelativeInformationBodyDTO, session: SignInSessionModel): Promise<PatientExternalModel> {
    await this.verifyRelationship(body, session);
    const newFmpId = await this.patientCreation(body);
    const patientExternalModel = await this.searchPatient(newFmpId, body.documentType, body.documentNumber);
    // patientExternalModel.validateCenter();
    await this.persistPatient(patientExternalModel);

    return patientExternalModel;
  }

  private async patientCreation(body: CreateRelativeInformationBodyDTO): Promise<PatientDM['fmpId']> {
    const creationResult = await this.confirmPatientRepository.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      secondLastName: body.secondLastName ?? null,
      birthDate: body.birthDate,
      gender: body.gender,
      documentNumber: body.documentNumber,
      documentType: body.documentType,
    });

    return creationResult.fmpId;
  }

  private async searchPatient(
    fmpId: PatientDM['fmpId'],
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const existingAccount = await this.getPatientAccountRepository.execute(documentType, documentNumber);
    const externalPatientModel = new PatientExternalModel(searchResult, existingAccount);

    return externalPatientModel;
  }

  private async persistPatient(patientExternalModel: PatientExternalModel): Promise<void> {
    if (!patientExternalModel.hasPersistedPatient()) {
      const { insertId } = await this.savePatientRepository.execute(patientExternalModel.toPersistPatientPayload());
      patientExternalModel.inyectPatientId(Number(insertId));
    }
  }

  private async verifyRelationship(body: CreateRelativeInformationBodyDTO, session: SignInSessionModel): Promise<void> {
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
      new SavePatientRepository(),
      new VerifyRelativeRepository(),
    );
  }
}
