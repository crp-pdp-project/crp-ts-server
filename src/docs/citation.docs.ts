import { AppointmentTypesListQueryDTOSchema } from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { DoctorsListQueryDTOSchema } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { InsurancesListOutputDTOSchema } from 'src/app/entities/dtos/output/insurancesList.output.dto';
import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class CitationDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/doctors`,
      description: 'List all doctors',
      tags: ['doctors', 'citation'],
      query: DoctorsListQueryDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: DoctorsListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/specialties`,
      description: 'List all specialties',
      tags: ['specialties', 'citation'],
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: SpecialtiesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/insurances`,
      description: 'List all insurances',
      tags: ['insurances', 'citation'],
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: InsurancesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/appointment-types`,
      description: 'List all appointment types',
      tags: ['appointment-types', 'citation'],
      query: AppointmentTypesListQueryDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: AppointmentTypesListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
