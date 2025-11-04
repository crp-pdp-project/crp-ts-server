import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PatientAppointmentsParamsDTOSchema } from 'src/app/entities/dtos/input/patientAppointment.input.dto';
import { PatientAppointmentItemOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointmentItem.output.dto';
import { PatientAppointmentListOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientAppointmentsV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/appointment/current`,
      description: 'Patient current appointment list',
      tags: ['patients', 'dashboard', 'appointments'],
      params: PatientAppointmentsParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientAppointmentListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/appointment/historic`,
      description: 'Patient historic appointment list',
      tags: ['patients', 'dashboard', 'appointments'],
      params: PatientAppointmentsParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientAppointmentListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/appointment/next`,
      description: 'Patient first current appointment',
      tags: ['patients', 'dashboard', 'appointments'],
      params: PatientAppointmentsParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientAppointmentItemOutputDTOSchema,
        }),
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
