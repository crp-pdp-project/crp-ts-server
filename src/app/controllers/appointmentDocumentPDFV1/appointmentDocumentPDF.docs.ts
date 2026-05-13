import { AppointmentDocumentPDFParamsDTOSchema } from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import type { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class AppointmentDocumentPDFV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/appointments/documents/{documentId}`,
      description: 'Obtain an appointment document',
      tags: ['patients', 'appointments', 'reports'],
      params: AppointmentDocumentPDFParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {},
      secure: true,
    });
  }
}
