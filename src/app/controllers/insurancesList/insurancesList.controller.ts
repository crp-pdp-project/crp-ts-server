import { FastifyReply, FastifyRequest } from 'fastify';

import { InsuranceListModel } from 'src/app/entities/models/insuranceList.model';
import { IInsurancesListInteractor } from 'src/app/interactors/insurancesList/insurancesList.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IInsurancesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class InsurancesListController implements IInsurancesListController {
  constructor(
    private readonly insurancesList: IInsurancesListInteractor,
    private readonly responseInteractor: IResponseInteractor<InsuranceListModel>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const insurances = await this.insurancesList.list(input);
    const response = this.responseInteractor.execute(insurances);
    reply.code(response.statusCode).send(response.body);
  }
}
