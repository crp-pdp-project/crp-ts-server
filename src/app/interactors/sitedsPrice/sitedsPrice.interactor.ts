import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { SitedsPriceBodyDTO, SitedsPriceParamsDTO } from 'src/app/entities/dtos/input/sitedsPrice.input.dto';
import type { PatientModel } from 'src/app/entities/models/patient/patient.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { SitedsModel } from 'src/app/entities/models/siteds/siteds.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import type { IGetSitedsInsuranceRepository } from 'src/app/repositories/soap/getSitedsInsurance.repository';
import { GetSitedsInsuranceRepository } from 'src/app/repositories/soap/getSitedsInsurance.repository';
import type { IGetSitedsPatientRepository } from 'src/app/repositories/soap/getSitedsPatient.repository';
import { GetSitedsPatientRepository } from 'src/app/repositories/soap/getSitedsPatient.repository';

export interface ISitedsPriceInteractor {
  obtain(body: SitedsPriceBodyDTO, params: SitedsPriceParamsDTO, session: SignInSessionModel): Promise<SitedsModel>;
}

export class SitedsPriceInteractor implements ISitedsPriceInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getSitedsPatient: IGetSitedsPatientRepository,
    private readonly getSitedsInsurance: IGetSitedsInsuranceRepository,
  ) {}

  async obtain(
    body: SitedsPriceBodyDTO,
    params: SitedsPriceParamsDTO,
    session: SignInSessionModel,
  ): Promise<SitedsModel> {
    await this.validateRelatives(params.fmpId, session);
    const patientModel = session.getPatient(params.fmpId);
    const sitedsModel = await this.getSitedsPatientInfo(body, patientModel);
    sitedsModel.validateDetails();
    await this.obtainSitedsCoverages(sitedsModel);
    sitedsModel.sanitizeDetails().validateInsurance();

    return sitedsModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
  }

  private async getSitedsPatientInfo(body: SitedsPriceBodyDTO, patient: PatientModel): Promise<SitedsModel> {
    const decodedPatient = await this.getSitedsPatient.execute(patient, body.iafaId, body.correlative);
    const model = SitedsModel.fromDTO(decodedPatient, patient.documentNumber!, patient.documentType!);

    return model;
  }

  private async obtainSitedsCoverages(sitedsModel: SitedsModel): Promise<void> {
    for (const detail of sitedsModel.details) {
      const coverageData = await this.getSitedsInsurance.execute({
        ...sitedsModel.getMainPayload(),
        ...detail.genCoveragePayload(),
      });

      detail.inyectCoverages(coverageData);
    }
  }
}

export class SitedsPriceInteractorBuilder {
  static build(): SitedsPriceInteractor {
    return new SitedsPriceInteractor(
      new PatientRelativesValidationRepository(),
      new GetSitedsPatientRepository(),
      new GetSitedsInsuranceRepository(),
    );
  }
}
