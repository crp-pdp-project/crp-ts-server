import { FastifyInstance } from 'fastify';

import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { DoctorsListBuilder } from '../controllers/doctorsList/doctorsList.builder';
import { IDoctorsListController } from '../controllers/doctorsList/doctorsList.controller';

export class CitationRouter {
  private readonly doctorsListController: IDoctorsListController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.doctorsListController = DoctorsListBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildSession();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/doctors',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.doctorsListController.handle.bind(this.doctorsListController),
    });
  }
}
