import { FastifyRequest } from 'fastify';

import {
  UpdatePatientPasswordBodyDTOSchema,
  UpdatePatientPasswordInputDTO,
} from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IAccountPasswordInteractor } from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import { IAccountPasswordControllerStrategy } from '../accountPassword.controller';

export class UpdatePasswordControllerStrategy implements IAccountPasswordControllerStrategy {
  async execute(
    input: FastifyRequest<UpdatePatientPasswordInputDTO>,
    interactor: IAccountPasswordInteractor,
  ): Promise<void> {
    const body = UpdatePatientPasswordBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.RECOVER, input.session);
    await interactor.persist(body, session);
  }
}
