import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { CancelAppointmentParamsDTOSchema } from 'src/app/entities/dtos/input/cancelAppointment.input.dto';
import { PatientAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointment.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class CancelAppointmentV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.DELETE,
      path: `${this.version}/patients/{fmpId}/appointments/{appointmentId}`,
      description: 'Delete an appointment',
      tags: ['patients', 'appointments'],
      params: CancelAppointmentParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientAppointmentOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
