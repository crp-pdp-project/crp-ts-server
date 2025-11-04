import { OperateRelativeParamsDTO } from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import {
  DeleteRelativeRepository,
  IDeleteRelativeRepository,
} from 'src/app/repositories/database/deleteRelative.repository';

export interface IRejectRelativeInteractor {
  reject(params: OperateRelativeParamsDTO): Promise<void>;
}

export class RejectRelativeInteractor implements IRejectRelativeInteractor {
  constructor(private readonly deleteRelative: IDeleteRelativeRepository) {}

  async reject(params: OperateRelativeParamsDTO): Promise<void> {
    await this.deleteRelative.execute(params.patientId, params.relativeId);
  }
}

export class RejectRelativeInteractorBuilder {
  static build(): RejectRelativeInteractor {
    return new RejectRelativeInteractor(new DeleteRelativeRepository());
  }
}
