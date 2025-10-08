import { PatientResultTypes, PatientResultTypesMapper } from 'src/general/enums/patientResultType.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { PatientResultDTO } from '../../dtos/service/patientResult.dto';
import { AppointmentTypeModel } from '../appointmentType/appointmentType.model';
import { BaseModel } from '../base.model';
import { DoctorModel } from '../doctor/doctor.model';
import { SpecialtyModel } from '../specialty/specialty.model';

export class PatientResultModel extends BaseModel {
  readonly resultId?: string;
  readonly episodeId?: string;
  readonly date?: string;
  readonly doctor?: DoctorModel;
  readonly specialty?: SpecialtyModel;
  readonly appointmentType?: AppointmentTypeModel;
  readonly type?: PatientResultTypes;
  readonly accessNumber?: string;
  readonly gidenpac?: string;

  constructor(patientResult: PatientResultDTO) {
    super();

    this.resultId = patientResult.resultId;
    this.episodeId = patientResult.episodeId;
    this.date = patientResult.date ? DateHelper.toFormatDateTime(patientResult.date, 'spanishDateTime') : undefined;
    this.doctor = patientResult.doctor ? new DoctorModel(patientResult.doctor) : undefined;
    this.specialty = patientResult.specialty ? new SpecialtyModel(patientResult.specialty) : undefined;
    this.appointmentType = patientResult.appointmentType
      ? new AppointmentTypeModel(patientResult.appointmentType)
      : undefined;
    this.type = patientResult.type ? PatientResultTypesMapper.getResultType(patientResult.type) : undefined;
    this.accessNumber = patientResult.accessNumber;
    this.gidenpac = patientResult.gidenpac;
  }
}
