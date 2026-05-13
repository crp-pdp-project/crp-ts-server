import type { InsuredPatientDuesParamsDTO } from 'src/app/entities/dtos/input/insuredPatientDues.input.dto';
import { InsuredPatientDuesModel } from 'src/app/entities/models/insuranceDue/insuredPatientDues.model';
import type { IGetInsuredPatientRepository } from 'src/app/repositories/rest/getInsuredPatient.respository';
import { GetInsuredPatientRepository } from 'src/app/repositories/rest/getInsuredPatient.respository';
import type { IGetInsuredPatientDuesRepository } from 'src/app/repositories/rest/getInsuredPatientDues.respository';
import { GetInsuredPatientDuesRepository } from 'src/app/repositories/rest/getInsuredPatientDues.respository';

export interface IInsuredPatientDuesInteractor {
  list(params: InsuredPatientDuesParamsDTO): Promise<InsuredPatientDuesModel>;
}

export class InsuredPatientDuesInteractor implements IInsuredPatientDuesInteractor {
  constructor(
    private readonly getInsuredPatient: IGetInsuredPatientRepository,
    private readonly getInsuredDues: IGetInsuredPatientDuesRepository,
  ) {}

  async list(params: InsuredPatientDuesParamsDTO): Promise<InsuredPatientDuesModel> {
    const insured = await this.getInsuredPatient.execute(params.contractId);
    const dues = await this.getInsuredDues.execute(params.contractId);

    return new InsuredPatientDuesModel(dues, insured, params.contractId);
  }
}

export class InsuredPatientDuesInteractorBuilder {
  static build(): InsuredPatientDuesInteractor {
    return new InsuredPatientDuesInteractor(new GetInsuredPatientRepository(), new GetInsuredPatientDuesRepository());
  }
}
