import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { TextHelper } from 'src/general/helpers/text.helper';

import { PatientDTO } from '../dtos/service/patient.dto';
import { PatientExternalDTO } from '../dtos/service/patientExternal.dto';

import { AccountModel } from './account.model';

export class PatientExternalModel extends BaseModel {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly maskedEmail: string | null;
  readonly phone: string | null;
  readonly maskedPhone: string | null;
  readonly #fmpId: string;
  readonly #nhcId: string;
  readonly #documentNumber: string;
  readonly #documentType: number;
  readonly #account?: AccountModel;

  constructor(patient: PatientDTO, external: PatientExternalDTO) {
    super();

    this.id = patient.id ?? 0;
    this.email = external.email;
    this.maskedEmail = TextHelper.maskEmail(external.email);
    this.phone = TextHelper.normalizePhoneNumber(external.phone);
    this.maskedPhone = TextHelper.maskPhone(external.phone);
    this.firstName = TextHelper.titleCase(external.firstName) ?? '';
    this.lastName = TextHelper.titleCase(external.lastName) ?? '';
    this.#fmpId = external.fmpId;
    this.#documentNumber = external.documentNumber;
    this.#nhcId = external.nhcId;
    this.#documentType = external.documentType;
    this.#account = patient.account ? new AccountModel(patient.account) : undefined;
  }

  toSessionPayload(): SessionPayloadDTO {
    return {
      patient: {
        id: this.id,
        fmpId: this.#fmpId,
        nhcId: this.#nhcId,
        documentNumber: this.#documentNumber,
        documentType: this.#documentType,
        firstName: this.firstName,
        lastName: this.lastName,
        account: this.#account ? { id: this.#account.id } : undefined,
      },
      external: {
        email: this.email,
        phone: this.phone,
      },
    };
  }
}
