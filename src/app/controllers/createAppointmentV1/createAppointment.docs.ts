import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  CreateAppointmentBodyDTOSchema,
  CreateAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/createAppointment.input.dto';
import { PatientAppointmentDetailOutputDTOSchema } from 'src/app/entities/dtos/output/patientAppointmentDetail.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class CreateAppointmentV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/{fmpId}/appointments`,
      description: 'Create a new appointment for a patient',
      tags: ['patients', 'appointments'],
      body: CreateAppointmentBodyDTOSchema,
      params: CreateAppointmentParamsDTOSchema,
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
