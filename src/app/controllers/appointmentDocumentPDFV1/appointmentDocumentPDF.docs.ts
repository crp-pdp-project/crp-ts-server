import { AppointmentDocumentPDFParamsDTOSchema } from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class AppointmentDocumentPDFV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/appointments/documents/{documentId}`,
      description: 'Obtain an appointment document',
      tags: ['patients', 'appointments'],
      params: AppointmentDocumentPDFParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema,
      },
      secure: true,
    });
  }
}
