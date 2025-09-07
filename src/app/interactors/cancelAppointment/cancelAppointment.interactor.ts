import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { CancelAppointmentParamsDTO } from 'src/app/entities/dtos/input/cancelAppointment.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetAppointmentDetailRepository,
  IGetAppointmentDetailRepository,
} from 'src/app/repositories/rest/getAppointmentDetail.repository';
import {
  CancelAppointmentRepository,
  ICancelAppointmentRepository,
} from 'src/app/repositories/soap/cancelAppointment.repository';
import { TipsType } from 'src/general/enums/tipsTypes.enum';
import { ValidationRules } from 'src/general/enums/validationRules.enum';

export interface ICancelAppointmentInteractor {
  cancel(params: CancelAppointmentParamsDTO, session: SignInSessionModel): Promise<AppointmentModel>;
}

export class CancelAppointmentInteractor implements ICancelAppointmentInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
    private readonly cancelAppointment: ICancelAppointmentRepository,
  ) {}

  async cancel(params: CancelAppointmentParamsDTO, session: SignInSessionModel): Promise<AppointmentModel> {
    await this.validateRelatives(params.fmpId, session);
    const appointmentModel = await this.getCancelAppointment(params.appointmentId);
    await this.cancelAppointment.execute(params.fmpId, appointmentModel.id!, appointmentModel.date!);

    return appointmentModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
  }

  private async getCancelAppointment(appointmentId: string): Promise<AppointmentModel> {
    const appointment = await this.appointmentDetail.execute(appointmentId);
    const model = new AppointmentModel(appointment).overrideTips(TipsType.CANCEL);

    return model;
  }
}

export class CancelAppointmentInteractorBuilder {
  static build(): CancelAppointmentInteractor {
    return new CancelAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new GetAppointmentDetailRepository(),
      new CancelAppointmentRepository(),
    );
  }
}
