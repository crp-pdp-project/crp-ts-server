import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientAppointmentsParamsDTO } from 'src/app/entities/dtos/input/patientAppointment.input.dto';
import type { BaseModel } from 'src/app/entities/models/base.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';

import { CurrentAppointmentsStrategyBuilder } from './strategies/currentAppointments.strategy';
import { HistoryAppointmentsStrategyBuilder } from './strategies/historicAppointments.strategy';
import { NextAppointmentStrategyBuilder } from './strategies/nextAppointment.strategy';

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
      NextAppointmentStrategyBuilder.build(),
    );
  }

  static buildCurrent(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      CurrentAppointmentsStrategyBuilder.build(),
    );
  }

  static buildHistoric(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      HistoryAppointmentsStrategyBuilder.build(),
    );
  }
}
