import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

type GetAppointmentDetailInput = {
  IdCita: string;
};

type GetAppointmentDetailOutput = {
  data?: {
    agrupacion: string;
    atendido: string;
    codInspeccion: string;
    colegiaturadelProfesional: string;
    idAgrupacion: string;
    idCentro: string;
    idEspecialidad: string;
    idPrestacion: string;
    idProfesional: string;
    idSociedad: string;
    nombresApellidos: string;
    presentado: string;
    prestacion: string;
    sexo: string;
    especialidad: string;
    medico: string;
    fechaCita: string;
    horaCita: string;
    seguro: string;
    modalidad: string;
    ruta: string;
    consultorio: string;
    estadoCita: string;
    idExterno: string;
    idCita: string;
    estadoPago: string;
    anulacion: string;
    reprogramacion: string;
    pago: string;
    tipo: string;
    codigoIAFA: string;
    codigoFAS: string;
  };
  esCorrecto: boolean;
};

export interface IGetAppointmentDetailRepository {
  execute(appointmentId: AppointmentDTO['id']): Promise<AppointmentDTO>;
}

export class GetAppointmentDetailRepository implements IGetAppointmentDetailRepository {
  private readonly crp = CRPClient.instance;

  async execute(appointmentId: AppointmentDTO['id']): Promise<AppointmentDTO> {
    const methodPayload = this.parseInput(appointmentId);
    const rawResult = await this.crp.call<GetAppointmentDetailOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.GET_APPOINTMENT_DETAIL,
      body: methodPayload,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(appointmentId: AppointmentDTO['id']): GetAppointmentDetailInput {
    return {
      IdCita: TextHelper.normalizeAppointmentId(appointmentId ?? ''),
    };
  }

  private parseOutput(rawResult: GetAppointmentDetailOutput): AppointmentDTO {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ message: 'Did not found the detail for the appointment' });
    }

    const result: AppointmentDTO = {
      id: String(data.idCita),
      episodeId: String(data.idExterno),
      date: `${data.horaCita} ${data.fechaCita}`,
      status: data.estadoCita,
      doctor: {
        id: String(data.idProfesional),
        name: data.medico,
      },
      specialty: {
        id: String(data.idEspecialidad),
        groupId: String(data.idAgrupacion),
        name: data.especialidad ?? '',
      },
      appointmentType: {
        id: TextHelper.normalizeAppointmentTypeId(String(data.idPrestacion), String(data.idEspecialidad)),
        name: data.prestacion ?? '',
      },
      insurance: {
        id: String(data.idSociedad),
        inspectionId: String(data.codInspeccion),
        iafaId: String(data.codigoIAFA),
        fasId: String(data.codigoFAS),
        type: String(data.tipo),
        name: data.seguro,
      },
      mode: data.modalidad,
      cancelAction: data.anulacion,
      rescheduleAction: data.reprogramacion,
      payAction: data.pago,
      payState: data.estadoPago,
    };

    return result;
  }
}

export class GetAppointmentDetailRepositoryMock implements IGetAppointmentDetailRepository {
  async execute(): Promise<AppointmentDTO> {
    return {
      id: 'C202538212187',
      episodeId: 'C25CLIRP38212187',
      date: '11:00:00 2025-04-15',
      status: 'Cerrado',
      doctor: {
        id: '09539819',
        name: 'MAURICIO LE',
      },
      specialty: {
        id: '7100',
        groupId: '71',
        name: 'Mastología',
      },
      appointmentType: {
        id: '10010942',
        name: '(MAS) CONSULTA NO PRESENCIAL (VIDEOCONFERENCIA) (Mastología) (500101)',
      },
      insurance: {
        id: '16725',
        inspectionId: '99',
        iafaId: '20007',
        fasId: '00061540',
        name: 'PLANSALUD CLINICA RICARDO PALMA',
      },
      mode: 'Virtual',
      cancelAction: 'A04',
      rescheduleAction: 'R03',
      payAction: 'P02',
      payState: 'Pagado',
    };
  }
}
