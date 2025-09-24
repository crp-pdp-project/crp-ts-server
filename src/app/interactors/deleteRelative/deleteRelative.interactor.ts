import { DeleteRelativeParamsDTO } from 'src/app/entities/dtos/input/deleteRelative.input.dto';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  DeleteRelativeRepository,
  IDeleteRelativeRepository,
} from 'src/app/repositories/database/deleteRelative.repository';

export interface IDeleteRelativeInteractor {
  delete(params: DeleteRelativeParamsDTO, session: SignInSessionModel): Promise<void>;
}

export class DeleteRelativeInteractor implements IDeleteRelativeInteractor {
  constructor(private readonly deleteRelative: IDeleteRelativeRepository) {}

  async delete(params: DeleteRelativeParamsDTO, session: SignInSessionModel): Promise<void> {
    await this.deleteRelative.execute(session.patient.id, params.relativeId);
  }
}

export class DeleteRelativeInteractorBuilder {
  static build(): DeleteRelativeInteractor {
    return new DeleteRelativeInteractor(new DeleteRelativeRepository());
  }
}
