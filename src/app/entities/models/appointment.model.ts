import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { AppointmentModes } from 'src/general/enums/appointmentMode.enum';
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
  readonly mode?: AppointmentModes;
  readonly doctor?: DoctorModel;
  readonly specialty?: SpecialtyModel;
  readonly insurance?: InsuranceModel;
  readonly appointmentType?: AppointmentTypeModel;
  readonly recommendations: readonly string[];
  readonly canCancel?: boolean;
  readonly canReprogram?: boolean;
  readonly didShow?: boolean;

  constructor(appointment: AppointmentDTO) {
    super();

    this.id = appointment.id;
    this.episodeId = appointment.episodeId;
    this.date = appointment.date ? DateHelper.toFormatDateTime(appointment.date, 'spanishDateTime') : appointment.date;
    this.status = AppointmentStates[appointment.status as keyof typeof AppointmentStates] ?? AppointmentStates.Citado;
    this.mode = appointment.appointmentType?.id
      ? appointment.appointmentType.id.includes(CRPConstants.VIRTUAL_ID)
        ? AppointmentModes.REMOTE
        : AppointmentModes.IN_PERSON
      : undefined;
    this.doctor = appointment.doctor ? new DoctorModel(appointment.doctor) : appointment.doctor;
    this.specialty = appointment.specialty ? new SpecialtyModel(appointment.specialty) : appointment.specialty;
    this.insurance = appointment.insurance ? new InsuranceModel(appointment.insurance) : appointment.insurance;
    this.appointmentType = appointment.appointmentType
      ? new AppointmentTypeModel(appointment.appointmentType)
      : appointment.appointmentType;
    this.recommendations = AppointmentConstants.DEFAULT_RECOMMENDATIONS;
    this.canCancel = appointment.canCancel;
    this.canReprogram = appointment.canReprogram;
    this.didShow = appointment.didShow;
  }
}
