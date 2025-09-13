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
  ) {}

  async create(
    body: CreateAppointmentBodyDTO,
    params: CreateAppointmentParamsDTO,
    session: SignInSessionModel,
  ): Promise<AppointmentModel> {
    const relatives = await this.getPatientRelatives(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(params.fmpId, ValidationRules.SELF_OR_RELATIVES);
    const payload = this.genPayload(params.fmpId, body);
    const appointmentId = await this.createAppointment(payload);
    const appointment = await this.getNewAppointment(appointmentId);

    return new AppointmentModel(appointment);
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

  private async getNewAppointment(appointmentId: string): Promise<AppointmentDTO> {
    const appointment = await this.appointmentDetail.execute(appointmentId);

    return appointment.id ? appointment : ({ id: appointmentId } as AppointmentDTO);
  }
}

export class CreateAppointmentInteractorBuilder {
  static build(): CreateAppointmentInteractor {
    return new CreateAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new SaveAppointmentRepository(),
      new GetAppointmentDetailRepository(),
    );
  }
}
