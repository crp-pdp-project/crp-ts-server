import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientAppointmentsParamsDTO } from 'src/app/entities/dtos/input/patientAppointment.input.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { GetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';

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
  private static readonly relativesRepository = new PatientRelativesValidationRepository();
  private static readonly currentRepository = new GetCurrentAppointmentsRepository();
  private static readonly historicRepository = new GetHistoricAppointmentsRepository();

  static buildNext(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      this.relativesRepository,
      new NextAppointmentStrategy(this.currentRepository),
    );
  }

  static buildCurrent(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      this.relativesRepository,
      new CurrentAppointmentsStrategy(this.currentRepository),
    );
  }

  static buildHistoric(): PatientAppointmentsInteractor {
    return new PatientAppointmentsInteractor(
      this.relativesRepository,
      new HistoryAppointmentsStrategy(this.historicRepository),
    );
  }
}
