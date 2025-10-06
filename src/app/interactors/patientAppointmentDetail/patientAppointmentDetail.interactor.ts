import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientAppointmentDetailParamsDTO } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { AppointmentDocumentListModel } from 'src/app/entities/models/appointmentDocument/appointmentDocumentList.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { SitedsModel } from 'src/app/entities/models/siteds/siteds.model';
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
import {
  GetSitedsInsuranceRepository,
  IGetSitedsInsuranceRepository,
} from 'src/app/repositories/soap/getSitedsInsurance.repository';
import {
  GetSitedsPatientRepository,
  IGetSitedsPatientRepository,
} from 'src/app/repositories/soap/getSitedsPatient.repository';

export interface IPatientAppointmentDetailInteractor {
  obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel>;
}

export class PatientAppointmentDetailInteractor implements IPatientAppointmentDetailInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
    private readonly appointmentDocuments: IGetAppointmentDocumentsRepository,
    private readonly getSitedsPatient: IGetSitedsPatientRepository,
    private readonly getSitedsInsurance: IGetSitedsInsuranceRepository,
  ) {}

  async obtain(params: PatientAppointmentDetailParamsDTO, session: SignInSessionModel): Promise<AppointmentModel> {
    await this.validateRelatives(params.fmpId, session);
    const patient = session.getPatient(params.fmpId);
    const appointmentModel = await this.fetchAppointment(params.appointmentId);
    await this.addDocuments(params.fmpId, session, appointmentModel);
    await this.addSiteds(patient, appointmentModel);

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
    if (session.isValidFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS) && appointment.shouldFetchDocuments()) {
      const documents = await this.appointmentDocuments.execute(fmpId, appointment.id!);
      const documentsList = new AppointmentDocumentListModel(documents);
      appointment.inyectDocuments(documentsList);
    }
  }

  private async addSiteds(patient: PatientModel, appointment: AppointmentModel): Promise<void> {
    if (appointment.shouldFetchSiteds()) {
      const decodedPatient = await this.getSitedsPatient.execute(patient, appointment.insurance!.iafaId!);
      const sitedsModel = new SitedsModel(decodedPatient, patient.documentNumber!, patient.documentType!);
      await this.obtainSitedsCoverages(sitedsModel, patient);
      appointment.inyectSiteds(sitedsModel.sanitizeDetails()).refreshStates();
    }
  }

  private async obtainSitedsCoverages(sitedsModel: SitedsModel, patient: PatientModel): Promise<void> {
    for (const detail of sitedsModel.details) {
      const coverageData = await this.getSitedsInsurance.execute(patient, {
        ...sitedsModel.getMainPayload(),
        ...detail.genCoveragePayload(),
      });

      detail.inyectCoverages(coverageData);
    }
  }
}

export class PatientAppointmentDetailInteractorBuilder {
  static build(): PatientAppointmentDetailInteractor {
    return new PatientAppointmentDetailInteractor(
      new PatientRelativesValidationRepository(),
      new GetAppointmentDetailRepository(),
      new GetAppointmentDocumentsRepository(),
      new GetSitedsPatientRepository(),
      new GetSitedsInsuranceRepository(),
    );
  }
}
