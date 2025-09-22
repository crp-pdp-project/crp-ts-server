import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { RelationshipDM } from 'src/app/entities/dms/relationships.dm';
import { CreateRelativeBodyDTO } from 'src/app/entities/dtos/input/createRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { GetPatientRepository, IGetPatientRepository } from 'src/app/repositories/database/getPatient.repository';
import { ISaveRelativeRepository, SaveRelativeRepository } from 'src/app/repositories/database/saveRelative.repository';
import {
  IVerifyRelativeRepository,
  VerifyRelativeRepository,
} from 'src/app/repositories/database/verifyRelative.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface ICreateRelativeInteractor {
  create(body: CreateRelativeBodyDTO, session: SignInSessionModel): Promise<void>;
}

export class CreateRelativeInteractor implements ICreateRelativeInteractor {
  constructor(
    private readonly verifyRelativeRepository: IVerifyRelativeRepository,
    private readonly getPatientRepository: IGetPatientRepository,
    private readonly saveRelativeRepository: ISaveRelativeRepository,
  ) {}

  async create(body: CreateRelativeBodyDTO, session: SignInSessionModel): Promise<void> {
    const relative = await this.getPatient(body.relativeId);
    relative.validatePatient();
    await this.verifyRelationship(session.patient.id, relative.id!);
    await this.persistRelative(session.patient.id, relative.id!, body.relationshipId);
  }

  private async getPatient(relativeId: PatientDM['id']): Promise<PatientModel> {
    const patient = await this.getPatientRepository.execute(relativeId);

    return new PatientModel(patient ?? {});
  }

  private async verifyRelationship(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<void> {
    const verifyResult = await this.verifyRelativeRepository.execute(principalId, relativeId);

    if (verifyResult.id) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.RELATIVE_EXISTS });
    }
  }

  private async persistRelative(
    principalId: PatientDM['id'],
    relativeId: PatientDM['id'],
    relationshipId: RelationshipDM['id'],
  ): Promise<void> {
    await this.saveRelativeRepository.execute(principalId, relativeId, relationshipId);
  }
}

export class CreateRelativeInteractorBuilder {
  static build(): CreateRelativeInteractor {
    return new CreateRelativeInteractor(
      new VerifyRelativeRepository(),
      new GetPatientRepository(),
      new SaveRelativeRepository(),
    );
  }
}
