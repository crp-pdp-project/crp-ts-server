import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { DeleteRelativeParamsDTO } from 'src/app/entities/dtos/input/deleteRelative.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import type { PatientLegalGuardianModel } from 'src/app/entities/models/patient/patientLegalGuardian.model';
import { PatientLegalGuardianListModel } from 'src/app/entities/models/patient/patientLegalGuardianList.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IDeleteRelativeRepository } from 'src/app/repositories/database/deleteRelative.repository';
import { DeleteRelativeRepository } from 'src/app/repositories/database/deleteRelative.repository';
import type { IGetPatientRelativeRepository } from 'src/app/repositories/database/getPatientRelative.repository';
import { GetPatientRelativeRepository } from 'src/app/repositories/database/getPatientRelative.repository';
import type { IDeleteLegalGuardianRepository } from 'src/app/repositories/soap/deleteLegalGuardian.repository';
import { DeleteLegalGuardianRepository } from 'src/app/repositories/soap/deleteLegalGuardian.repository';
import type { IGetLegalGuardiansRepository } from 'src/app/repositories/soap/getLegalGuardians.repository';
import { GetLegalGuardiansRepository } from 'src/app/repositories/soap/getLegalGuardians.repository';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IDeleteRelativeInteractor {
  delete(params: DeleteRelativeParamsDTO, session: SignInSessionModel): Promise<void>;
}

export class DeleteRelativeInteractor implements IDeleteRelativeInteractor {
  private readonly logger: LoggerClient = LoggerClient.instance;

  constructor(
    private readonly listLegalGuardians: IGetLegalGuardiansRepository,
    private readonly getPatientRelative: IGetPatientRelativeRepository,
    private readonly deleteLegalGuardian: IDeleteLegalGuardianRepository,
    private readonly deleteRelative: IDeleteRelativeRepository,
  ) {}

  async delete(params: DeleteRelativeParamsDTO, session: SignInSessionModel): Promise<void> {
    const relative = await this.getRelative(session.patient.id, params.relativeId);
    if (relative.isMinor()) {
      const legalGuardian = await this.getLegalGuardian(relative.fmpId!, session.patient.documentNumber);
      await this.deleteGuardian(relative.fmpId!, legalGuardian);
    }
    await this.deleteRelative.execute(session.patient.id, params.relativeId);
  }

  private async getRelative(patientId: PatientDM['id'], relativeId: PatientDM['id']): Promise<PatientModel> {
    const relative = await this.getPatientRelative.execute(patientId, relativeId);

    if (!relative) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }

    return new PatientModel(relative);
  }

  private async getLegalGuardian(
    relativeFmpId: PatientDM['fmpId'],
    guardianDocumentNumber: PatientDM['documentNumber'],
  ): Promise<PatientLegalGuardianModel | undefined> {
    const legalGuardians = await this.listLegalGuardians.execute(relativeFmpId);

    return new PatientLegalGuardianListModel(legalGuardians).getLegalGuardian(guardianDocumentNumber);
  }

  private async deleteGuardian(
    relativeFmpId: PatientDM['fmpId'],
    legalGuardian?: PatientLegalGuardianModel,
  ): Promise<void> {
    if (legalGuardian) {
      await this.deleteLegalGuardian.execute(relativeFmpId, legalGuardian.legalGuardianId!);
    } else {
      this.logger.info('No legal guardian found', { relativeFmpId });
    }
  }
}

export class DeleteRelativeInteractorBuilder {
  static build(): DeleteRelativeInteractor {
    return new DeleteRelativeInteractor(
      new GetLegalGuardiansRepository(),
      new GetPatientRelativeRepository(),
      new DeleteLegalGuardianRepository(),
      new DeleteRelativeRepository(),
    );
  }
}
