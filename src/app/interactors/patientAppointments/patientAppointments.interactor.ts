import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientAppointmentsParamsDTO } from 'src/app/entities/dtos/input/patientAppointment.input.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetAppointmentsRepository } from 'src/app/repositories/soap/getAppointments.repository';

import { CurrentAppointmentsStrategy } from './strategies/currentAppointments.strategy';
import { HistoryAppointmentsStrategy } from './strategies/historicAppointments.strategy';
import { NextAppointmentStrategy } from './strategies/nextAppointment.strategy';

export interface IPatientAppointmentsStrategy {
  fetchData(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<BaseModel | void>;
}

export interface IPatientAppointmentsInteractor {
  getAppointmentInfo(params: PatientAppointmentsParamsDTO, session: SignInSessionModel): Promise<BaseModel | void>;
}

export class PatientAppointmentsInteractor implements IPatientAppointmentsInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly patientAppointmentStrategy: IPatientAppointmentsStrategy,
  ) {}

  async getAppointmentInfo(
    params: PatientAppointmentsParamsDTO,
    session: SignInSessionModel,
  ): Promise<BaseModel | void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives);

    return this.patientAppointmentStrategy.fetchData(params.fmpId, session);
  }
}

export class PatientAppointmentsInteractorBuilder {
  static buildNext(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new NextAppointmentStrategy(new GetAppointmentsRepository()),
    );
  }

  static buildCurrent(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new CurrentAppointmentsStrategy(new GetAppointmentsRepository()),
    );
  }

  static buildHistoric(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new HistoryAppointmentsStrategy(new GetAppointmentsRepository()),
    );
  }
}
