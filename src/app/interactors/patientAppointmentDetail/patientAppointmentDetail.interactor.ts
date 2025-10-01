import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientAppointmentDetailParamsDTO } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { AppointmentDocumentListModel } from 'src/app/entities/models/appointmentDocument/appointmentDocumentList.model';
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
  GetAppointmentDocumentsRepository,
  IGetAppointmentDocumentsRepository,
} from 'src/app/repositories/soap/getAppointmentDocuments.repository';

export interface IPatientAppointmentDetailInteractor {
  obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel>;
}

export class PatientAppointmentDetailInteractor implements IPatientAppointmentDetailInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
    private readonly appointmentDocuments: IGetAppointmentDocumentsRepository,
  ) {}

  async obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel> {
    await this.validateRelatives(params.fmpId, session);
    const appointmentModel = await this.fetchAppointment(params.appointmentId);
    await this.addDocuments(params.fmpId, session, appointmentModel);

    return appointmentModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_VERIFIED);
  }

  private async fetchAppointment(appointmentId: string): Promise<AppointmentModel> {
    const appointment = await this.appointmentDetail.execute(appointmentId);

    return new AppointmentModel(appointment);
  }

  private async addDocuments(
    fmpId: PatientDM['fmpId'],
    session: SignInSessionModel,
    appointment: AppointmentModel,
  ): Promise<void> {
    if (session.isValidFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS)) {
      const documents = await this.appointmentDocuments.execute(fmpId, appointment.id!);
      const documentsList = new AppointmentDocumentListModel(documents);
      appointment.inyectDocuments(documentsList);
    }
  }
}

export class PatientAppointmentDetailInteractorBuilder {
  static build(): PatientAppointmentDetailInteractor {
    return new PatientAppointmentDetailInteractor(
      new PatientRelativesValidationRepository(),
      new GetAppointmentDetailRepository(),
      new GetAppointmentDocumentsRepository(),
    );
  }
}
