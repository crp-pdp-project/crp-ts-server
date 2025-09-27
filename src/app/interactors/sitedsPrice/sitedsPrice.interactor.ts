// import { PatientDM } from 'src/app/entities/dms/patients.dm';
// import { SitedsPriceBodyDTO, SitedsPriceParamsDTO } from 'src/app/entities/dtos/input/sitedsPrice.input.dto';
// import { AppointmentModel } from 'src/app/entities/models/appointment/appointment.model';
// import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
// import {
//   IPatientRelativesValidationRepository,
//   PatientRelativesValidationRepository,
// } from 'src/app/repositories/database/patientRelativesValidation.repository';
// import {
//   GetAppointmentDetailRepository,
//   IGetAppointmentDetailRepository,
// } from 'src/app/repositories/rest/getAppointmentDetail.repository';

// export interface ISitedsPriceInteractor {
//   reschedule(
//     body: SitedsPriceBodyDTO,
//     params: SitedsPriceParamsDTO,
//     session: SignInSessionModel,
//   ): Promise<AppointmentModel>;
// }

// export class SitedsPriceInteractor implements ISitedsPriceInteractor {
//   constructor(
//     private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
//     private readonly appointmentDetail: IGetAppointmentDetailRepository,
//   ) {}

//   async reschedule(
//     body: SitedsPriceBodyDTO,
//     params: SitedsPriceParamsDTO,
//     session: SignInSessionModel,
//   ): Promise<AppointmentModel> {
//     await this.validateRelatives(params.fmpId, session);
//     await this.rescheduleAppointment.execute({ ...params, ...body });
//     const appointmentModel = await this.getSitedsPrice(params.appointmentId);

//     return appointmentModel;
//   }

//   private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
//     const relatives = await this.patientRelativesValidation.execute(session.patient.id);
//     session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
//   }

//   private async getSitedsPrice(appointmentId: string): Promise<AppointmentModel> {
//     const appointment = await this.appointmentDetail.execute(appointmentId);
//     const model = new AppointmentModel(appointment);

//     return model;
//   }
// }

// export class SitedsPriceInteractorBuilder {
//   static build(): SitedsPriceInteractor {
//     return new SitedsPriceInteractor(
//       new PatientRelativesValidationRepository(),
//       new GetAppointmentDetailRepository(),
//       new SitedsPriceRepository(),
//     );
//   }
// }
