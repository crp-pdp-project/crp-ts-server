import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { AvailabilityListQueryDTO } from 'src/app/entities/dtos/input/availabilityList.input.dto';
import type { AvailabilityRequestDTO } from 'src/app/entities/dtos/service/availabilityRequest.dto';
import type { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availability/availabilityList.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import type { IGetDoctorAvailabilityRepository } from 'src/app/repositories/soap/getDoctorAvailability.repository';
import { GetDoctorAvailabilityRepository } from 'src/app/repositories/soap/getDoctorAvailability.repository';

export interface IAvailabilityListInteractor {
  list(query: AvailabilityListQueryDTO, session: SignInSessionModel): Promise<AvailabilityListModel>;
}

export class AvailabilityListInteractor implements IAvailabilityListInteractor {
  constructor(
    private readonly getAvailability: IGetDoctorAvailabilityRepository,
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
  ) {}

  async list(query: AvailabilityListQueryDTO, session: SignInSessionModel): Promise<AvailabilityListModel> {
    const relatives = await this.getPatientRelatives(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(query.fmpId, ValidationRules.SELF_OR_RELATIVES);
    const availabilityList = await this.getAvailabilityList({
      ...query,
      filterDate: query.date,
      firstAvailable: false,
    });

    return new AvailabilityListModel(availabilityList, query.filter);
  }

  private async getPatientRelatives(id: PatientDM['id']): Promise<PatientDTO[]> {
    const relatives = await this.patientRelativesValidation.execute(id);

    return relatives;
  }

  private async getAvailabilityList(payload: AvailabilityRequestDTO): Promise<DoctorAvailabilityDTO[]> {
    const availabilityList = await this.getAvailability.execute(payload);

    return availabilityList;
  }
}

export class AvailabilityListInteractorBuilder {
  static build(): AvailabilityListInteractor {
    return new AvailabilityListInteractor(
      new GetDoctorAvailabilityRepository(),
      new PatientRelativesValidationRepository(),
    );
  }
}
