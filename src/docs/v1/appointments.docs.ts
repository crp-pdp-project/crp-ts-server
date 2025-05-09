import { AppointmentTypesListQueryDTOSchema } from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AvailabilityListQueryDTOSchema } from 'src/app/entities/dtos/input/availabilityList.input.dto';
import { DoctorsListQueryDTOSchema } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { AvailabilityListOutputDTOSchema } from 'src/app/entities/dtos/output/availabilityList.output.dto';
import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { InsurancesListOutputDTOSchema } from 'src/app/entities/dtos/output/insurancesList.output.dto';
import { PatientRelativesOutputDTOSchema } from 'src/app/entities/dtos/output/patientRelatives.output.dto';
import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class AppointmentV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/doctors`,
      description: 'List all doctors',
      tags: ['doctors', 'appointments'],
      query: DoctorsListQueryDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: DoctorsListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/specialties`,
      description: 'List all specialties',
      tags: ['specialties', 'appointments'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: SpecialtiesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/insurances`,
      description: 'List all insurances',
      tags: ['insurances', 'appointments'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: InsurancesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/appointment-types`,
      description: 'List all appointment types',
      tags: ['appointment-types', 'appointments'],
      query: AppointmentTypesListQueryDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: AppointmentTypesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/relatives`,
      description: 'Get all patient relatives',
      tags: ['patients', 'appointments'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientRelativesOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/doctors/availability`,
      description: 'List all availability of a doctor',
      tags: ['doctors', 'appointments'],
      query: AvailabilityListQueryDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: AvailabilityListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
