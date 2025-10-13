import { FastifyRequest } from 'fastify';

import {
  CreateEnrolledAccountBodyDTOSchema,
  CreateEnrolledAccountInputDTO,
} from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IAccountPasswordInteractor } from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { IAccountPasswordControllerStrategy } from '../accountPassword.controller';

export class CreatePasswordControllerStrategy implements IAccountPasswordControllerStrategy {
  async execute(
    input: FastifyRequest<CreateEnrolledAccountInputDTO>,
    interactor: IAccountPasswordInteractor,
  ): Promise<void> {
    const body = CreateEnrolledAccountBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.ENROLL, input.session);
    await interactor.persist(body, session);
  }
}
