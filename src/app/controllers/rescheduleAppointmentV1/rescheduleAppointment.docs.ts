import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  RescheduleAppointmentBodyDTOSchema,
  RescheduleAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/rescheduleAppointment.input.dto';
import { PatientAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointment.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class RescheduleAppointmentV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/patients/{fmpId}/appointments/{appointmentId}`,
      description: 'Reschedule an appointment',
      tags: ['patients', 'appointments'],
      params: RescheduleAppointmentParamsDTOSchema,
      body: RescheduleAppointmentBodyDTOSchema,
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
