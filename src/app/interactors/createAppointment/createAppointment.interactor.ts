import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  CreateAppointmentBodyDTO,
  CreateAppointmentParamsDTO,
} from 'src/app/entities/dtos/input/createAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import {
  AppointmentRequestDTO,
  AppointmentRequestDTOSchema,
} from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
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
  GetSitedsInsuranceRepository,
  IGetSitedsInsuranceRepository,
} from 'src/app/repositories/soap/getSitedsInsurance.repository';
import {
  GetSitedsPatientRepository,
  IGetSitedsPatientRepository,
} from 'src/app/repositories/soap/getSitedsPatient.repository';
import {
  ISaveAppointmentRepository,
  SaveAppointmentRepository,
} from 'src/app/repositories/soap/saveAppointment.repository';

export interface ICreateAppointmentInteractor {
  create(
    body: CreateAppointmentBodyDTO,
    params: CreateAppointmentParamsDTO,
    session: SignInSessionModel,
  ): Promise<AppointmentModel>;
}

export class CreateAppointmentInteractor implements ICreateAppointmentInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly saveAppointment: ISaveAppointmentRepository,
    private readonly appointmentDetail: IGetAppointmentDetailRepository,
    private readonly getSitedsPatient: IGetSitedsPatientRepository,
    private readonly getSitedsInsurance: IGetSitedsInsuranceRepository,
  ) {}

  async create(
    body: CreateAppointmentBodyDTO,
    params: CreateAppointmentParamsDTO,
    session: SignInSessionModel,
  ): Promise<AppointmentModel> {
    const relatives = await this.getPatientRelatives(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(params.fmpId, ValidationRules.SELF_OR_RELATIVES);
    const patient = session.getPatient(params.fmpId);
    const payload = this.genPayload(params.fmpId, body);
    const appointmentId = await this.createAppointment(payload);
    const appointmentModel = await this.getNewAppointment(appointmentId);
    await this.addSiteds(patient, appointmentModel);

    return appointmentModel;
  }

  private async getPatientRelatives(id: PatientDM['id']): Promise<PatientDTO[]> {
    const relatives = await this.patientRelativesValidation.execute(id);

    return relatives;
  }

  private genPayload(fmpId: PatientDM['fmpId'], body: CreateAppointmentBodyDTO): AppointmentRequestDTO {
    const payload = AppointmentRequestDTOSchema.parse({ fmpId, ...body });

    return payload;
  }

  private async createAppointment(payload: AppointmentRequestDTO): Promise<string> {
    const newAppointment = await this.saveAppointment.execute(payload);

    return newAppointment.id!;
  }

  private async getNewAppointment(appointmentId: string): Promise<AppointmentModel> {
    const appointment = await this.appointmentDetail.execute(appointmentId);
    const payload = appointment.id ? appointment : ({ id: appointmentId } as AppointmentDTO);

    return new AppointmentModel(payload);
  }

  private async addSiteds(patient: PatientModel, appointment: AppointmentModel): Promise<void> {
    if (appointment.shouldFetchSiteds()) {
      const decodedPatient = await this.getSitedsPatient.execute(patient, appointment.insurance!.iafaId!);
      const sitedsModel = SitedsModel.fromDTO(decodedPatient, patient.documentNumber!, patient.documentType!);
      await this.obtainSitedsCoverages(sitedsModel, patient);
      appointment.inyectSiteds(sitedsModel.sanitizeDetails().generateBase64()).refreshStates();
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

export class CreateAppointmentInteractorBuilder {
  static build(): CreateAppointmentInteractor {
    return new CreateAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new SaveAppointmentRepository(),
      new GetAppointmentDetailRepository(),
      new GetSitedsPatientRepository(),
      new GetSitedsInsuranceRepository(),
    );
  }
}
