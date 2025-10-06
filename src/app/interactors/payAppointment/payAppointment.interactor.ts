import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PayAppointmentBodyDTO, PayAppointmentParamsDTO } from 'src/app/entities/dtos/input/payAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { POSAuthorizationDTO } from 'src/app/entities/dtos/service/posAuthorization.dto';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
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
  IPayAppointmentRepository,
  PayAppointmentRepository,
} from 'src/app/repositories/rest/payAppointment.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IPayAppointmentInteractor {
  pay(body: PayAppointmentBodyDTO, params: PayAppointmentParamsDTO, session: SignInSessionModel): Promise<void>;
}

export class PayAppointmentInteractor implements IPayAppointmentInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly getAppointmentDetail: IGetAppointmentDetailRepository,
    private readonly payAppointment: IPayAppointmentRepository,
  ) {}

  async pay(body: PayAppointmentBodyDTO, params: PayAppointmentParamsDTO, session: SignInSessionModel): Promise<void> {
    await this.validateRelatives(params.fmpId, session);
    const patient = session.getPatient(params.fmpId);
    const sitedsModel = this.parseModel(body.siteds, patient);
    const externalPatientModel = await this.searchPatient(session);
    const appointment = await this.searchAppointment(params.appointmentId);
    await this.payAppointment.execute(
      this.createAuthorizationPayload(sitedsModel, body, externalPatientModel),
      sitedsModel.getAxionalPayload(session),
      appointment,
    );
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
  }

  private parseModel(base64: string, patient: PatientModel): SitedsModel {
    const sitedsModel = SitedsModel.fromBase64(base64, patient.documentNumber!, patient.documentType!);
    sitedsModel.validateInsurance();

    return sitedsModel;
  }

  private async searchPatient(session: SignInSessionModel): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });

    const externalPatientModel = new PatientExternalModel(searchResult, session.patient);

    return externalPatientModel;
  }

  private async searchAppointment(appointmetnId: string): Promise<AppointmentDTO> {
    const appointmentResult = await this.getAppointmentDetail.execute(appointmetnId);

    return appointmentResult;
  }

  private createAuthorizationPayload(
    sitedsModel: SitedsModel,
    body: PayAppointmentBodyDTO,
    patient: PatientExternalModel,
  ): POSAuthorizationDTO {
    const coverage = sitedsModel.details?.[0]?.coverages?.[0];
    return {
      purchaseNumber: body.authorization.correlative,
      tokenId: body.authorization.tokenId,
      commerceCode: body.authorization.commerceCode,
      amount: coverage!.copayFixed!,
      email: patient.email,
    };
  }
}

export class PayAppointmentInteractorBuilder {
  static build(): PayAppointmentInteractor {
    return new PayAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new SearchPatientRepository(),
      new GetAppointmentDetailRepository(),
      new PayAppointmentRepository(),
    );
  }
}
