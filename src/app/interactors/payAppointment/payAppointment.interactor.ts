import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PayAppointmentBodyDTO, PayAppointmentParamsDTO } from 'src/app/entities/dtos/input/payAppointment.input.dto';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { AxionalPayloadDTO } from 'src/app/entities/dtos/service/axionalPayload.dto';
import { POSAuthorizationDTO } from 'src/app/entities/dtos/service/posAuthorization.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
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
    this.checkPatientConsistency(params.fmpId, body, session);
    const externalPatientModel = await this.searchPatient(session);
    const appointment = await this.searchAppointment(params.appointmentId);
    await this.payAppointment.execute(
      this.createAuthorizationPayload(body, externalPatientModel),
      this.createAxionalPayload(body, session),
      appointment,
    );
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
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

  private checkPatientConsistency(
    fmpId: PatientDM['fmpId'],
    body: PayAppointmentBodyDTO,
    session: SignInSessionModel,
  ): void {
    const { siteds } = body;
    const detail = siteds.details[0];
    const patient = session.getPatient(fmpId);

    if (patient.documentNumber !== detail.patientDocumentNumber) {
      throw ErrorModel.badRequest({ message: 'Patient info does not match siteds payload' });
    }
  }

  private createAxionalPayload(body: PayAppointmentBodyDTO, session: SignInSessionModel): AxionalPayloadDTO {
    const { patient: client } = session;
    const { siteds } = body;
    const detail = siteds.details[0];
    const coverage = detail.coverages[0];

    return {
      ipressId: siteds.ipressId,
      iafaId: siteds.iafaId,
      date: siteds.date,
      time: siteds.time,
      patientEntityType: detail.patientEntityType,
      patientLastName: detail.patientLastName,
      patientFirstName: detail.patientFirstName,
      patientMemberId: detail.patientMemberId,
      patientSecondLastName: detail.patientSecondLastName,
      patientDocumentType: detail.patientDocumentType,
      patientDocumentNumber: detail.patientDocumentNumber,
      clientLastName: client.lastName,
      clientFirstName: client.firstName,
      clientDocumentType: client.documentType,
      clientDocumentNumber: client.documentNumber,
      productCode: detail.productCode,
      productDescription: detail.productDescription,
      contractorEntityType: detail.contractorEntityType,
      contractorFirstName: detail.contractorFirstName,
      contractorDocumentType: detail.contractorDocumentType,
      contractorIdQualifier: detail.contractorIdQualifier,
      contractorId: detail.contractorId,
      coverageTypeCode: coverage.coverageTypeCode,
      coverageSubtypeCode: coverage.coverageSubtypeCode,
      currencyCode: coverage.currencyCode,
      copayFixed: coverage.copayFixed,
      serviceCalcCode: coverage.serviceCalcCode,
      serviceCalcQuantity: coverage.serviceCalcQuantity,
      copayVariable: coverage.copayVariable,
      taxAmount: coverage.taxAmount,
      preTaxAmount: coverage.preTaxAmount,
    };
  }

  private createAuthorizationPayload(body: PayAppointmentBodyDTO, patient: PatientExternalModel): POSAuthorizationDTO {
    const coverage = body.siteds.details[0].coverages[0];
    return {
      purchaseNumber: body.authorization.correlative,
      tokenId: body.authorization.tokenId,
      commerceCode: body.authorization.commerceCode,
      amount: coverage.copayFixed,
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
