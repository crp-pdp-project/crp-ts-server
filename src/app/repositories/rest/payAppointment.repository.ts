import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { AxionalPayloadDTO } from 'src/app/entities/dtos/service/axionalPayload.dto';
import { POSAuthorizationDTO } from 'src/app/entities/dtos/service/posAuthorization.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { PosConstants } from 'src/general/contants/pos.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DocumentTypeMapper } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { coverageTypeMap } from 'src/general/managers/x12/maps/coverageType.map';
import { currencyTypeMap } from 'src/general/managers/x12/maps/currencyType.map';
import { documentTypeMap } from 'src/general/managers/x12/maps/documentType.map';
import { entityTypeMap } from 'src/general/managers/x12/maps/entityType.map';

type PayAppointmentInput = {
  authorization: {
    purchaseNumber: string;
    amount: number;
    currency: string;
    tokenId: string;
    email: string;
    codigoComercio: string;
  };
  axional: {
    admision: {
      episodio: string;
      cod_iafa: string;
      cod_finan: string;
      fechacita: string;
      horacita: string;
    };
    feTransaccion: string;
    hoTransaccion: string;
    dvPagoBase: string;
    imPagoBase: number;
    imPagoIGV: number;
    imPagoTotal: number;
    tdCliente: string;
    ndCliente: string;
    psCliente: string;
    noCliente: string;
    apCliente: string;
    amCliente: string;
    diCliente: string;
    rsCliente: string;
    emCliente: string;
    ngCliente: string;
    caPaciente: string;
    afPaciente: string;
    noPaciente: string;
    apPaciente: string;
    amPaciente: string;
    ndPaciente: string;
    tdPaciente: string;
    coProducto: string;
    deProducto: string;
    tiCobertura: string;
    stCobertura: string;
    caContratante: string;
    coContratante: string;
    noContratante: string;
    idContratante: string;
    tdContratante: string;
    coCargoTipo: string;
    tiCopagoVar: string;
    caCopagoFij: string;
    prCopagoFij: number;
    imCopagoFij: number;
    dvCopagoFij: string;
    prCopagoVar: number;
  };
};

type PayAppointmentOutput = {
  esCorrecto: boolean;
};

export interface IPayAppointmentRepository {
  execute(authorization: POSAuthorizationDTO, axional: AxionalPayloadDTO, appointment: AppointmentDTO): Promise<void>;
}

export class PayAppointmentRepository implements IPayAppointmentRepository {
  private readonly crp = CRPClient.instance;

  async execute(
    authorization: POSAuthorizationDTO,
    axional: AxionalPayloadDTO,
    appointment: AppointmentDTO,
  ): Promise<void> {
    const methodPayload = this.parseInput(authorization, axional, appointment);
    const rawResult = await this.crp.call<PayAppointmentOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.PAY_APPOINTMENT,
      body: methodPayload,
    });
    this.checkOutput(rawResult);
  }

  private parseInput(
    authorization: POSAuthorizationDTO,
    axional: AxionalPayloadDTO,
    appointment: AppointmentDTO,
  ): PayAppointmentInput {
    return {
      authorization: {
        purchaseNumber: authorization.purchaseNumber,
        amount: authorization.amount,
        currency: authorization.currency ?? PosConstants.DEFAULT_CURRENCY,
        tokenId: authorization.tokenId,
        email: authorization.email ?? PosConstants.DEFAULT_EMAIL,
        codigoComercio: authorization.commerceCode,
      },
      axional: {
        admision: {
          episodio: appointment.episodeId ?? '',
          cod_iafa: appointment.insurance?.iafaId ?? '',
          cod_finan: appointment.insurance?.fasId ?? '',
          fechacita: appointment.date ? DateHelper.toFormatDate(appointment.date, 'crpDate') : '',
          horacita: appointment.date ? DateHelper.toFormatTime(appointment.date, 'spanishTimeShort') : '',
        },
        feTransaccion: DateHelper.toFormatDate(axional.date, 'crpDate'),
        hoTransaccion: DateHelper.toFormatTime(axional.time, 'spanishTimeShort'),
        dvPagoBase: CRPConstants.DEFAULT_CURRENCY,
        imPagoBase: axional.preTaxAmount,
        imPagoIGV: axional.taxAmount,
        imPagoTotal: axional.copayFixed,
        tdCliente: DocumentTypeMapper.getCrpShortDocumentType(axional.clientDocumentType),
        ndCliente: axional.clientDocumentNumber,
        psCliente: CRPConstants.DEFAULT_COUNTRY,
        noCliente: axional.clientFirstName,
        apCliente: axional.clientLastName,
        amCliente: axional.clientSecondLastName ?? '',
        diCliente: '',
        rsCliente: '',
        emCliente: '',
        ngCliente: '',
        caPaciente: entityTypeMap.encode[axional.patientEntityType] ?? axional.patientEntityType,
        afPaciente: axional.patientMemberId,
        noPaciente: axional.patientFirstName,
        apPaciente: axional.patientLastName,
        amPaciente: axional.patientSecondLastName ?? '',
        ndPaciente: axional.patientDocumentNumber,
        tdPaciente: documentTypeMap.encode[axional.patientDocumentType] ?? axional.patientDocumentType,
        coProducto: axional.productCode,
        deProducto: axional.productDescription,
        tiCobertura: coverageTypeMap.encode[axional.coverageTypeCode] ?? axional.coverageTypeCode,
        stCobertura: axional.coverageSubtypeCode,
        caContratante: entityTypeMap.encode[axional.contractorEntityType] ?? axional.contractorEntityType,
        coContratante: axional.contractorId,
        noContratante: axional.contractorFirstName,
        idContratante: axional.contractorIdQualifier,
        tdContratante: documentTypeMap.encode[axional.contractorDocumentType] ?? axional.contractorDocumentType,
        coCargoTipo: '',
        tiCopagoVar: '',
        caCopagoFij: axional.serviceCalcCode,
        prCopagoFij: axional.serviceCalcQuantity,
        imCopagoFij: axional.copayFixed,
        dvCopagoFij: currencyTypeMap.encode[axional.currencyCode] ?? axional.currencyCode,
        prCopagoVar: axional.copayVariable,
      },
    };
  }

  private checkOutput(rawResult: PayAppointmentOutput): void {
    const { esCorrecto } = rawResult;

    if (!esCorrecto) {
      throw ErrorModel.badRequest({ message: 'Error processing the appointment payment' });
    }
  }
}

export class PayAppointmentRepositoryMock implements IPayAppointmentRepository {
  async execute(): Promise<void> {
    await Promise.resolve();
  }
}
