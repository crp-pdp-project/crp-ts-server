import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientAppointmentDetailParamsDTO } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
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

export interface IPatientAppointmentDetailInteractor {
  obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel>;
}

export class PatientAppointmentDetailInteractor implements IPatientAppointmentDetailInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
  ) {}

  async obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel> {
    await this.validateRelatives(params.fmpId, session);
    const appointment = await this.appointmentDetail.execute(params.appointmentId);

    return new AppointmentModel(appointment);
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_VERIFIED);
  }
}

export class PatientAppointmentDetailInteractorBuilder {
  static build(): PatientAppointmentDetailInteractor {
    return new PatientAppointmentDetailInteractor(
      new PatientRelativesValidationRepository(),
      new GetAppointmentDetailRepository(),
    );
  }
}
