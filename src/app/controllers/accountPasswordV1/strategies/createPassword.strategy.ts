import type { FastifyRequest } from 'fastify';

import type { CreateEnrolledAccountInputDTO } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { CreateEnrolledAccountBodyDTOSchema } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IAccountPasswordInteractor } from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { AccountPasswordInteractorBuilder } from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import type { IAccountPasswordControllerStrategy } from '../accountPassword.controller';

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
