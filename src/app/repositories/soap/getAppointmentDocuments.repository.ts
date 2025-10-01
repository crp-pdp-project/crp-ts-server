// import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
// import { InetumCatalogServices, InetumClient } from 'src/clients/inetum.client';
// import { CRPConstants } from 'src/general/contants/crp.constants';
// import { EnvHelper } from 'src/general/helpers/env.helper';

// type GetAppointmentDocumentsInput = {
//   usuario: string;
//   contrasena: string;
//   peticionListadoInformesPaciente: {
//     IdPaciente: string;
//     IdCentro: string;
//     FechaDesde?: string;
//     FechaHasta?: string;
//     HoraDesde?: string;
//     HoraHasta?: string;
//     NumRegistros?: string;
//     CanalEntrada: string;
//     IdCita: string;
//   };
// };

// type GetAppointmentDocumentsOutput = {
//   ListadoProfesionalesResult: {
//     Profesionales: {
//       Profesional: {
//         DniProfesional: string;
//         Nombre: string;
//         IdEspecialidad: string;
//         DescEspecialidad: string;
//       }[];
//     };
//   };
// };

// export interface IGetAppointmentDocumentsRepository {
//   execute(specialtyId?: string): Promise<DoctorDTO[]>;
// }

// export class GetAppointmentDocumentsRepository implements IGetAppointmentDocumentsRepository {
//   private readonly user: string = EnvHelper.get('INETUM_USER');
//   private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

//   async execute(specialtyId?: string): Promise<DoctorDTO[]> {
//     const methodPayload = this.parseInput(specialtyId);
//     const instance = await InetumClient.getInstance();
//     const rawResult = await instance.catalog.call<GetAppointmentDocumentsOutput>(InetumCatalogServices.LIST_DOCTORS, methodPayload);
//     return this.parseOutput(rawResult);
//   }

//   private parseInput(specialtyId?: string): GetAppointmentDocumentsInput {
//     return {
//       usuario: this.user,
//       contrasena: this.password,
//       peticionListadoInformesPaciente: {
//         IdCentro: CRPConstants.CENTER_ID,
//         IdEspecialidad: specialtyId,
//         CanalEntrada: CRPConstants.ORIGIN,
//       },
//     };
//   }

//   private parseOutput(rawResult: GetAppointmentDocumentsOutput): DoctorDTO[] {
//     let result = rawResult.ListadoProfesionalesResult?.Profesionales?.Profesional ?? [];
//     result = Array.isArray(result) ? result : [result];

//     const doctors: DoctorDTO[] = result.map((professional) => ({
//       id: String(professional.DniProfesional),
//       name: professional.Nombre ?? '',
//       specialty: {
//         id: String(professional.IdEspecialidad),
//         groupId: String(professional.IdEspecialidad).slice(0, -2) || '0',
//         name: professional.DescEspecialidad ?? '',
//       },
//     }));

//     return doctors;
//   }
// }

// export class GetAppointmentDocumentsRepositoryMock implements IGetAppointmentDocumentsRepository {
//   async execute(): Promise<DoctorDTO[]> {
//     return [
//       {
//         id: '70358611',
//         name: 'MARÍA DEL CARMEN PA JA',
//         specialty: {
//           id: '3706',
//           name: 'Medicina Física y Rehabilitación',
//         },
//       },
//     ];
//   }
// }
