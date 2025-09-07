import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PatientAppointmentDetailParamsDTOSchema } from 'src/app/entities/dtos/input/patientAppointmentDetail.input.dto';
import { PatientAppointmentDetailOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointmentDetail.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientAppointmentDetailV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/{fmpId}/appointments/{appointmentId}`,
      description: 'Detail for an appointment',
      tags: ['patients', 'appointments'],
      params: PatientAppointmentDetailParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientAppointmentDetailOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
