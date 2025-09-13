import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  RescheduleAppointmentBodyDTO,
  RescheduleAppointmentParamsDTO,
} from 'src/app/entities/dtos/input/rescheduleAppointment.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetAppointmentDetailRepository,
  IGetAppointmentDetailRepository,
} from 'src/app/repositories/rest/getAppointmentDetail.repository';
import {
  IRescheduleAppointmentRepository,
  RescheduleAppointmentRepository,
} from 'src/app/repositories/soap/rescheduleAppointment.repository';

export interface IRescheduleAppointmentInteractor {
  reschedule(
    body: RescheduleAppointmentBodyDTO,
    params: RescheduleAppointmentParamsDTO,
    session: SignInSessionModel,
  ): Promise<AppointmentModel>;
}

export class RescheduleAppointmentInteractor implements IRescheduleAppointmentInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
    private readonly rescheduleAppointment: IRescheduleAppointmentRepository,
  ) {}

  async reschedule(
    body: RescheduleAppointmentBodyDTO,
    params: RescheduleAppointmentParamsDTO,
    session: SignInSessionModel,
  ): Promise<AppointmentModel> {
    await this.validateRelatives(params.fmpId, session);
    await this.rescheduleAppointment.execute({ ...params, ...body });
    const appointmentModel = await this.getRescheduleAppointment(params.appointmentId);

    return appointmentModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }

  private async getRescheduleAppointment(appointmentId: string): Promise<AppointmentModel> {
    const appointment = await this.appointmentDetail.execute(appointmentId);
    const model = new AppointmentModel(appointment);

    return model;
  }
}

export class RescheduleAppointmentInteractorBuilder {
  static build(): RescheduleAppointmentInteractor {
    return new RescheduleAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new GetAppointmentDetailRepository(),
      new RescheduleAppointmentRepository(),
    );
  }
}
