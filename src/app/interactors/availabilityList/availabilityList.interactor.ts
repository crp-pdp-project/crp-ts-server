import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AvailabilityListQueryDTO } from 'src/app/entities/dtos/input/availabilityList.input.dto';
import { AvailabilityRequestDTO } from 'src/app/entities/dtos/service/availabilityRequest.dto';
import { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availability/availabilityList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetDoctorAvailabilityRepository,
  IGetDoctorAvailabilityRepository,
} from 'src/app/repositories/soap/getDoctorAvailability.repository';

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
    const availabilityList = await this.getAvailabilityList({ ...query, firstAvailable: false });

    return new AvailabilityListModel(availabilityList);
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
