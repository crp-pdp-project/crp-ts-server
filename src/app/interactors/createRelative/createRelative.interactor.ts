import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { RelationshipDM } from 'src/app/entities/dms/relationships.dm';
import type { CreateRelativeBodyDTO } from 'src/app/entities/dtos/input/createRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IGetPatientRepository } from 'src/app/repositories/database/getPatient.repository';
import { GetPatientRepository } from 'src/app/repositories/database/getPatient.repository';
import type { ISaveRelativeRepository } from 'src/app/repositories/database/saveRelative.repository';
import { SaveRelativeRepository } from 'src/app/repositories/database/saveRelative.repository';
import type { IVerifyRelativeRepository } from 'src/app/repositories/database/verifyRelative.repository';
import { VerifyRelativeRepository } from 'src/app/repositories/database/verifyRelative.repository';
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
    await this.verifyRelationship(relative, session);
    await this.persistRelative(session.patient.id, relative.id!, body.relationshipId);
  }

  private async getPatient(relativeId: PatientDM['id']): Promise<PatientModel> {
    const patient = await this.getPatientRepository.execute(relativeId);

    return new PatientModel(patient ?? {});
  }

  private async verifyRelationship(relative: PatientModel, session: SignInSessionModel): Promise<void> {
    const verifyResult = await this.verifyRelativeRepository.execute(
      session.patient.id,
      relative.documentNumber!,
      relative.documentType!,
    );

    if (verifyResult?.id || relative.id === session.patient.id) {
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
