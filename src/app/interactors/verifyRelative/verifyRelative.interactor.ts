import { OperateRelativeParamsDTO } from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import {
  IUpdateRelativeVerificationRepository,
  UpdateRelativeVerificationRepository,
} from 'src/app/repositories/database/updateRelativeVerification.repository';

export interface IVerifyRelativeInteractor {
  verify(params: OperateRelativeParamsDTO): Promise<void>;
}

export class VerifyRelativeInteractor implements IVerifyRelativeInteractor {
  constructor(private readonly verifyRelative: IUpdateRelativeVerificationRepository) {}

  async verify(params: OperateRelativeParamsDTO): Promise<void> {
    await this.verifyRelative.execute(params.patientId, params.relativeId, true);
  }
}

export class VerifyRelativeInteractorBuilder {
  static build(): VerifyRelativeInteractor {
    return new VerifyRelativeInteractor(new UpdateRelativeVerificationRepository());
  }
}
