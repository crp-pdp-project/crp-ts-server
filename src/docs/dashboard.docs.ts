import { PatientHistoricAppointmentsQueryDTOSchema } from 'src/app/entities/dtos/input/patientHistoricAppointments.input.dto';
import { PatientCurrentAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientCurrentAppointment.output.dto';
import { PatientHistoricAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class DashboardDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/patients/appointment/current`,
      description: 'Patient current appointment list',
      tags: ['patients', 'dashboard'],
      responses: {
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
          data: PatientCurrentAppointmentsOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/patients/appointment/historic`,
      description: 'Patient historic appointment list',
      tags: ['patients', 'dashboard'],
      query: PatientHistoricAppointmentsQueryDTOSchema,
      responses: {
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
          data: PatientHistoricAppointmentsOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
