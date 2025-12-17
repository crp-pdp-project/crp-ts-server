import { FastifyRequest } from 'fastify';

import {
  CreateEnrolledAccountBodyDTOSchema,
  CreateEnrolledAccountInputDTO,
} from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  AccountPasswordInteractorBuilder,
  IAccountPasswordInteractor,
} from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { IAccountPasswordControllerStrategy } from '../accountPassword.controller';

export class CreatePasswordControllerStrategy implements IAccountPasswordControllerStrategy {
  constructor(private readonly interactor: IAccountPasswordInteractor) {}
  async execute(input: FastifyRequest<CreateEnrolledAccountInputDTO>): Promise<void> {
    const body = CreateEnrolledAccountBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.ENROLL, input.session);
    await this.interactor.persist(body, session);
  }
}

export class CreatePasswordControllerStrategyBuilder {
  static build(): CreatePasswordControllerStrategy {
    return new CreatePasswordControllerStrategy(AccountPasswordInteractorBuilder.buildCreate());
  }
}
