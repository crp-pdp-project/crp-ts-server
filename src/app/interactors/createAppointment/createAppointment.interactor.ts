import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type {
  CreateAppointmentBodyDTO,
  CreateAppointmentParamsDTO,
} from 'src/app/entities/dtos/input/createAppointment.input.dto';
import type { AppointmentRequestDTO } from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { AppointmentRequestDTOSchema } from 'src/app/entities/dtos/service/appointmentRequest.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { PatientModel } from 'src/app/entities/models/patient/patient.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { SitedsModel } from 'src/app/entities/models/siteds/siteds.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import type { IGetAppointmentDetailRepository } from 'src/app/repositories/rest/getAppointmentDetail.repository';
import { GetAppointmentDetailRepository } from 'src/app/repositories/rest/getAppointmentDetail.repository';
import type { IGetSitedsInsuranceRepository } from 'src/app/repositories/soap/getSitedsInsurance.repository';
import { GetSitedsInsuranceRepository } from 'src/app/repositories/soap/getSitedsInsurance.repository';
import type { IGetSitedsPatientRepository } from 'src/app/repositories/soap/getSitedsPatient.repository';
import { GetSitedsPatientRepository } from 'src/app/repositories/soap/getSitedsPatient.repository';
import type { ISaveAppointmentRepository } from 'src/app/repositories/soap/saveAppointment.repository';
import { SaveAppointmentRepository } from 'src/app/repositories/soap/saveAppointment.repository';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

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
    await this.addSiteds(patient, appointmentModel).catch((error) => {
      LoggerClient.instance.error('Error adding siteds, bypassed', {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    });

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
    const appointment = await this.appointmentDetail.execute(appointmentId).catch(() => {
      throw ErrorModel.conflict({ detail: ClientErrorMessages.APPOINTMENT_PARTIAL_SUCCESS });
    });

    return new AppointmentModel(appointment);
  }

  private async addSiteds(patient: PatientModel, appointment: AppointmentModel): Promise<void> {
    if (appointment.shouldFetchSiteds()) {
      const decodedPatient = await this.getSitedsPatient.execute(patient, appointment.insurance!.iafaId!);
      const sitedsModel = SitedsModel.fromDTO(decodedPatient, patient.documentNumber!, patient.documentType!);
      await this.obtainSitedsCoverages(sitedsModel);
      appointment.inyectSiteds(sitedsModel.sanitizeDetails().generateBase64());
    }
  }

  private async obtainSitedsCoverages(sitedsModel: SitedsModel): Promise<void> {
    for (const detail of sitedsModel.details) {
      const coverageData = await this.getSitedsInsurance.execute({
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
