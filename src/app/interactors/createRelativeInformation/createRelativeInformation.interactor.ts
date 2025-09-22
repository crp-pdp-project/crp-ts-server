import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { CreateRelativeInformationBodyDTO } from 'src/app/entities/dtos/input/createRelativeInformation.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
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
  create(body: CreateRelativeInformationBodyDTO, session: SignInSessionModel): Promise<PatientModel>;
}

export class CreateRelativeInformationInteractor implements ICreateRelativeInformationInteractor {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
  ) {}

  async create(body: CreateRelativeInformationBodyDTO, session: SignInSessionModel): Promise<PatientModel> {
    const newFmpId = await this.patientCreation(body);
    const patientExternalModel = await this.searchPatient(newFmpId);
    patientExternalModel.validateCenter();
    const relative = await this.persistPatient(patientExternalModel);
    await this.verifyRelationship(session.patient.id, relative.id!);

    return relative;
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

  private async searchPatient(fmpId: PatientDM['fmpId']): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const externalPatientModel = new PatientExternalModel(searchResult);

    return externalPatientModel;
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

export class CreateRelativeInformationInteractorBuilder {
  static build(): CreateRelativeInformationInteractor {
    return new CreateRelativeInformationInteractor(
      new ConfirmPatientRepository(),
      new SearchPatientRepository(),
      new SavePatientRepository(),
      new VerifyRelativeRepository(),
    );
  }
}
