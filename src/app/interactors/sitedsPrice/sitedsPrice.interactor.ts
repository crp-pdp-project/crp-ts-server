import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { SitedsPriceBodyDTO, SitedsPriceParamsDTO } from 'src/app/entities/dtos/input/sitedsPrice.input.dto';
import { ConNom271DTO } from 'src/app/entities/dtos/service/conNom271.dto';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import { SitedsModel } from 'src/app/entities/models/siteds/siteds.model';
import {
  GetPatientInformationRepository,
  IGetPatientInformationRepository,
} from 'src/app/repositories/database/getPatientInformation.repository';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetSitedsInsuranceRepository,
  IGetSitedsInsuranceRepository,
} from 'src/app/repositories/soap/getSitedsInsurance.repository';
import {
  GetSitedsPatientRepository,
  IGetSitedsPatientRepository,
} from 'src/app/repositories/soap/getSitedsPatient.repository';

export interface ISitedsPriceInteractor {
  obtain(body: SitedsPriceBodyDTO, params: SitedsPriceParamsDTO, session: SignInSessionModel): Promise<SitedsModel>;
}

export class SitedsPriceInteractor implements ISitedsPriceInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getPatientInformation: IGetPatientInformationRepository,
    private readonly getSitedsPatient: IGetSitedsPatientRepository,
    private readonly getSitedsInsurance: IGetSitedsInsuranceRepository,
  ) {}

  async obtain(
    body: SitedsPriceBodyDTO,
    params: SitedsPriceParamsDTO,
    session: SignInSessionModel,
  ): Promise<SitedsModel> {
    await this.validateRelatives(params.fmpId, session);
    const patientModel = await this.getPatientInfo(params.fmpId);
    const sitedsPatient = await this.getSitedsPatientInfo(body, patientModel);
    const enrichedPatient = await this.enrichSitedsPatientInfo(sitedsPatient, patientModel);
    const model = new SitedsModel(enrichedPatient);
    // TODO SITEDS VALIDATIONS
    return model;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_RELATIVES);
  }

  private async getPatientInfo(fmpId: PatientDM['fmpId']): Promise<PatientModel> {
    const patient = await this.getPatientInformation.execute(fmpId);
    const model = new PatientModel(patient ?? {});
    model.validatePatient();
    return model;
  }

  private async getSitedsPatientInfo(body: SitedsPriceBodyDTO, patient: PatientModel): Promise<ConNom271DTO> {
    const decodedPatient = await this.getSitedsPatient.execute(patient, body.iafaId, body.correlative);

    return decodedPatient;
  }

  private async enrichSitedsPatientInfo(sitedsPatient: ConNom271DTO, patient: PatientModel): Promise<ConNom271DTO> {
    for (const detail of sitedsPatient.details) {
      detail.prices = await this.getSitedsInsurance.execute(patient, {
        iafaId: sitedsPatient.iafaId,
        correlative: sitedsPatient.correlative,
        patientMemberId: detail.patientMemberId,
        planNumber: detail.planNumber,
        productCode: detail.productCode,
        relationshipCode: detail.relationshipCode,
        contractorDocumentType: detail.contractorDocumentType,
        contractorIdQualifier: detail.contractorIdQualifier,
        contractorId: detail.contractorId,
        contractorEntityType: detail.contractorEntityType,
      });
    }

    return sitedsPatient;
  }
}

export class SitedsPriceInteractorBuilder {
  static build(): SitedsPriceInteractor {
    return new SitedsPriceInteractor(
      new PatientRelativesValidationRepository(),
      new GetPatientInformationRepository(),
      new GetSitedsPatientRepository(),
      new GetSitedsInsuranceRepository(),
    );
  }
}
