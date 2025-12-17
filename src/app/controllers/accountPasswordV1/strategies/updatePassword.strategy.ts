import { FastifyRequest } from 'fastify';

import {
  UpdatePatientPasswordBodyDTOSchema,
  UpdatePatientPasswordInputDTO,
} from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  AccountPasswordInteractorBuilder,
  IAccountPasswordInteractor,
} from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { IAccountPasswordControllerStrategy } from '../accountPassword.controller';

export class UpdatePasswordControllerStrategy implements IAccountPasswordControllerStrategy {
  constructor(private readonly interactor: IAccountPasswordInteractor) {}
  async execute(input: FastifyRequest<UpdatePatientPasswordInputDTO>): Promise<void> {
    const body = UpdatePatientPasswordBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.RECOVER, input.session);
    await this.interactor.persist(body, session);
  }
}

export class UpdatePasswordControllerStrategyBuilder {
  static build(): UpdatePasswordControllerStrategy {
    return new UpdatePasswordControllerStrategy(AccountPasswordInteractorBuilder.buildUpdate());
  }
}
