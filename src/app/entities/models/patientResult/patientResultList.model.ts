import { DateHelper } from 'src/general/helpers/date.helper';

import { PatientResultDTO } from '../../dtos/service/patientResult.dto';
import { BaseModel } from '../base.model';

import { PatientResultModel } from './patientResult.model';

export class PatientResultListModel extends BaseModel {
  readonly results: PatientResultModel[];

  constructor(patientResults: PatientResultDTO[]) {
    super();

    this.results = this.generatePatientResults(patientResults);
  }

  private generatePatientResults(patientResults: PatientResultDTO[]): PatientResultModel[] {
    const sortedResults = this.sortPatientResults(patientResults);
    return sortedResults.map((result) => new PatientResultModel(result));
  }

  private sortPatientResults(list: PatientResultDTO[]): PatientResultDTO[] {
    return list.sort((a, b) => {
      const dateA = DateHelper.toDate(a.date ?? '');
      const dateB = DateHelper.toDate(b.date ?? '');

      return dateB.diff(dateA);
    });
  }
}
