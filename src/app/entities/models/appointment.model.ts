import { AppointmentStates } from 'src/general/enums/appointmentState.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { AppointmentDTO } from '../dtos/service/appointment.dto';

import { AppointmentTypeModel } from './appointmentType.model';
import { BaseModel } from './base.model';
import { DoctorModel } from './doctor.model';
import { InsuranceModel } from './insurance.model';
import { SpecialtyModel } from './specialty.model';

export class AppointmentModel extends BaseModel {
  readonly id?: string;
  readonly episodeId?: string;
  readonly date?: string;
  readonly status?: AppointmentStates;
  readonly mode?: string;
  readonly doctor?: DoctorModel;
  readonly specialty?: SpecialtyModel;
  readonly insurance?: InsuranceModel;
  readonly appointmentType?: AppointmentTypeModel;
  readonly canCancel?: boolean;
  readonly canReprogram?: boolean;
  readonly didShow?: boolean;

  constructor(appointment: AppointmentDTO) {
    super();

    this.id = appointment.id;
    this.episodeId = appointment.episodeId;
    this.date = appointment.date ? DateHelper.toFormatDate(appointment.date, 'spanishDate') : appointment.date;
    this.status = AppointmentStates[appointment.status as keyof typeof AppointmentStates] ?? AppointmentStates.Citado;
    this.mode = appointment.appointmentType?.id
      ? appointment.appointmentType.id.includes(process.env.CRP_VIRTUAL_ID ?? '')
        ? 'Virtual'
        : 'Presencial'
      : undefined;
    this.doctor = appointment.doctor ? new DoctorModel(appointment.doctor) : appointment.doctor;
    this.specialty = appointment.specialty ? new SpecialtyModel(appointment.specialty) : appointment.specialty;
    this.insurance = appointment.insurance ? new InsuranceModel(appointment.insurance) : appointment.insurance;
    this.appointmentType = appointment.appointmentType
      ? new AppointmentTypeModel(appointment.appointmentType)
      : appointment.appointmentType;
    this.canCancel = appointment.canCancel;
    this.canReprogram = appointment.canReprogram;
    this.didShow = appointment.didShow;
  }
}
