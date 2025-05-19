import { FastifyRequest } from 'fastify';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  AvailabilityListInputDTO,
  AvailabilityListQueryDTO,
  AvailabilityListQueryDTOSchema,
} from 'src/app/entities/dtos/input/availabilityList.input.dto';
import {
  AvailabilityRequestDTO,
  AvailabilityRequestDTOSchema,
} from 'src/app/entities/dtos/service/availabilityRequest.dto';
import { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availabilityList.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { GetDoctorAvailabilityRepository } from 'src/app/repositories/soap/getDoctorAvailability.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IAvailabilityListInteractor {
  list(input: FastifyRequest<AvailabilityListInputDTO>): Promise<AvailabilityListModel | ErrorModel>;
}

export class AvailabilityListInteractor implements IAvailabilityListInteractor {
  constructor(private readonly getAvailability: GetDoctorAvailabilityRepository) {}

  async list(input: FastifyRequest<AvailabilityListInputDTO>): Promise<AvailabilityListModel | ErrorModel> {
    try {
      const fmpId = this.validateSession(input.session);
      const query = this.validateInput(input.query);
      const payload = this.genPayload(fmpId, query);
      const availabilityList = await this.getAvailabilityList(payload);

      return new AvailabilityListModel(availabilityList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): PatientDM['fmpId'] {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session.patient.fmpId;
  }

  private validateInput(input?: AvailabilityListQueryDTO): AvailabilityListQueryDTO {
    const query = AvailabilityListQueryDTOSchema.parse(input);

    return query;
  }

  private genPayload(fmpId: PatientDM['fmpId'], query: AvailabilityListQueryDTO): AvailabilityRequestDTO {
    const payload = AvailabilityRequestDTOSchema.parse({ fmpId, ...query });

    return payload;
  }

  private async getAvailabilityList(payload: AvailabilityRequestDTO): Promise<DoctorAvailabilityDTO[]> {
    const availabilityList = await this.getAvailability.execute(payload);

    return availabilityList;
  }
}
