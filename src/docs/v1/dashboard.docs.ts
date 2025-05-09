import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { PatientCurrentAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientCurrentAppointment.output.dto';
import { PatientHistoricAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { PatientNextAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/patientNextAppointment.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class DashboardV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/appointment/current`,
      description: 'Patient current appointment list',
      tags: ['patients', 'dashboard'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientCurrentAppointmentsOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/appointment/historic`,
      description: 'Patient historic appointment list',
      tags: ['patients', 'dashboard'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientHistoricAppointmentsOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/appointment/next`,
      description: 'Patient first current appointment',
      tags: ['patients', 'dashboard'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientNextAppointmentOutputDTOSchema,
        }),
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
