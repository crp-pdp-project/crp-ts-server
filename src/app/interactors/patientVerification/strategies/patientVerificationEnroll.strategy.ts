import { PatientDTO, PatientDTOSchema } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ISavePatientRepository } from 'src/app/repositories/database/savePatient.repository';
import { IConfirmPatientRepository } from 'src/app/repositories/soap/confirmPatient.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

import { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationEnrollStrategy implements IPatientVerificationStrategy {
  constructor(
    private readonly confirmPatientRepository: IConfirmPatientRepository,
    private readonly savePatientRepository: ISavePatientRepository,
  ) {}

  async persisVerification(searchResult: PatientExternalDTO, patient?: PatientDTO | null): Promise<number> {
    let id = patient?.id ?? 0;
    if (!patient) {
      const patientToSave = this.createPatientDTO(searchResult);
      await this.confirmPatientCreation(searchResult);
      id = await this.persistPatient(patientToSave);
    }

    return id;
  }

  private createPatientDTO(searchResult: PatientExternalDTO): PatientDTO {
    const patientToSave: PatientDTO = {
      fmpId: searchResult.fmpId,
      nhcId: searchResult.nhcId,
      firstName: TextHelper.titleCase(searchResult.firstName),
      lastName: TextHelper.titleCase(searchResult.lastName),
      secondLastName: searchResult.secondLastName ? TextHelper.titleCase(searchResult.secondLastName) : null,
      birthDate: DateHelper.toFormatDate(searchResult.birthDate, 'dbDate'),
      documentNumber: searchResult.documentNumber,
      documentType: searchResult.documentType,
    };

    return PatientDTOSchema.parse(patientToSave);
  }

  private async confirmPatientCreation(searchResult: PatientExternalDTO): Promise<void> {
    const confirmationResult = await this.confirmPatientRepository.execute(searchResult);

    if (confirmationResult.fmpId !== searchResult.fmpId) {
      throw ErrorModel.unprocessable(ClientErrorMessages.UNPROCESSABLE_PATIENT);
    }
  }

  private async persistPatient(patientToSave: PatientDTO): Promise<number> {
    const { insertId } = await this.savePatientRepository.execute(patientToSave);
    return Number(insertId);
  }
}
