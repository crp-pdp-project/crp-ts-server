import type { PatientReportGroup, PatientReportTypes } from 'src/general/enums/patientReportType.enum';
import { PatientReportTypesMapper } from 'src/general/enums/patientReportType.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import type { PatientReportDTO } from '../../dtos/service/patientReport.dto';
import { AppointmentTypeModel } from '../appointmentType/appointmentType.model';
import { BaseModel } from '../base.model';
import { DoctorModel } from '../doctor/doctor.model';
import { ReportTypeModel } from '../reportType/reportType.model';
import { SpecialtyModel } from '../specialty/specialty.model';

export class PatientReportModel extends BaseModel {
  readonly resultId?: string;
  readonly documentId?: string;
  readonly episodeId?: string;
  readonly nhcId?: string;
  readonly date?: string;
  readonly doctor?: DoctorModel;
  readonly specialty?: SpecialtyModel;
  readonly appointmentType?: AppointmentTypeModel;
  readonly reportType?: ReportTypeModel;
  readonly type?: PatientReportTypes;
  readonly group?: PatientReportGroup;
  readonly accessNumber?: string;
  readonly gidenpac?: string;

  constructor(patientResult: PatientReportDTO) {
    super();

    this.resultId = patientResult.resultId;
    this.documentId = patientResult.documentId;
    this.episodeId = patientResult.episodeId;
    this.nhcId = patientResult.nhcId;
    this.date = this.resolveDate(patientResult);
    this.doctor = patientResult.doctor ? new DoctorModel(patientResult.doctor) : undefined;
    this.specialty = patientResult.specialty ? new SpecialtyModel(patientResult.specialty) : undefined;
    this.appointmentType = patientResult.appointmentType
      ? new AppointmentTypeModel(patientResult.appointmentType)
      : undefined;
    this.reportType = patientResult.type
      ? new ReportTypeModel(PatientReportTypesMapper.getReportTypeDto(patientResult.type))
      : undefined;
    this.type = patientResult.type ? PatientReportTypesMapper.getReportType(patientResult.type) : undefined;
    this.group = patientResult.type ? PatientReportTypesMapper.getReportGroup(patientResult.type) : undefined;
    this.accessNumber = patientResult.accessNumber;
    this.gidenpac = patientResult.gidenpac;
  }

  private resolveDate(patientResult: PatientReportDTO): string | undefined {
    const { date, time } = patientResult;

    if (!date) return;

    const format = time ? `${date}${DateHelper.toDate('inetumTime', time)}` : date;
    return DateHelper.toDate('spanishDateTime', format);
  }
}
