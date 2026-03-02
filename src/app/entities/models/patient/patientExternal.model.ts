import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { EnrollSessionPayloadDTO } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { EnrollSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import type { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import type { RecoverSessionPayloadDTO } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { RecoverSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import type { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { PatientDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

import type { DeviceDM } from '../../dms/devices.dm';
import { AccountModel } from '../account/account.model';
import { DeviceModel } from '../device/device.model';
import { ErrorModel } from '../error/error.model';

export class PatientExternalModel extends BaseModel {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly maskedEmail: string | null;
  readonly phone: string | null;
  readonly maskedPhone: string | null;
  readonly fmpId?: string;
  readonly documentNumber?: string;
  readonly documentType?: PatientDocumentType;
  readonly birthDate?: string;
  readonly account?: AccountModel;

  readonly #secondLastName: string | null;

  #id?: number;
  #device?: DeviceModel;
  #nhcId: string | null;
  #searchResult: PatientExternalDTO;

  constructor(external: PatientExternalDTO, patient?: PatientDTO) {
    super();

    this.#id = patient?.id;
    this.email = external.email ?? null;
    this.maskedEmail = TextHelper.maskEmail(external.email) ?? null;
    this.phone = TextHelper.normalizePhoneNumber(external.phone) ?? null;
    this.maskedPhone = TextHelper.maskPhone(external.phone) ?? null;
    this.firstName = TextHelper.titleCase(external.firstName) ?? '';
    this.lastName = TextHelper.titleCase(external.lastName) ?? '';
    this.#secondLastName = external.secondLastName ? TextHelper.titleCase(external.secondLastName)! : null;
    this.birthDate = external.birthDate ? DateHelper.toDate('dbDate', external.birthDate) : undefined;
    this.fmpId = external.fmpId;
    this.documentNumber = external.documentNumber;
    this.#nhcId = external.nhcId ?? null;
    this.documentType = external.documentType ? this.ensureDocumentType(external.documentType) : undefined;
    this.account = patient?.account ? new AccountModel(patient.account) : undefined;
    this.#searchResult = external;
  }

  get id(): number | undefined {
    return this.#id;
  }

  get device(): DeviceModel | undefined {
    return this.#device;
  }

  get nhcId(): string | null {
    return this.#nhcId;
  }

  validateExistance(): void {
    if (!this.fmpId) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }
  }

  validatePatient(): void {
    this.validateExistance();
    if (!this.email && !this.phone) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.UNPROCESSABLE_PATIENT });
    }
  }

  hasValidAccount(): boolean {
    return !!this.#id && !!this.account;
  }

  updateModel(external: PatientExternalDTO): this {
    this.#searchResult = external;
    this.#nhcId = external.nhcId ?? null;
    return this;
  }

  inyectPatientId(id: PatientDM['id']): this {
    this.#id = id;

    return this;
  }

  inyectNewDevice(id: DeviceDM['id']): this {
    this.#device = new DeviceModel({ id });
    return this;
  }

  toEnrollSession(): EnrollSessionPayloadDTO {
    const payload = this.toSessionPayload();

    return EnrollSessionPayloadDTOSchema.parse(payload);
  }

  toRecoverSession(): RecoverSessionPayloadDTO {
    const payload = this.toSessionPayload();

    return RecoverSessionPayloadDTOSchema.parse(payload);
  }

  toPersistPatientPayload(): PatientDTO {
    return {
      fmpId: this.fmpId,
      nhcId: this.#nhcId,
      firstName: this.firstName,
      lastName: this.lastName,
      secondLastName: this.#secondLastName,
      birthDate: this.birthDate,
      documentNumber: this.documentNumber,
      documentType: this.documentType,
    };
  }

  getRawSearchResult(): PatientExternalDTO {
    return this.#searchResult;
  }

  private ensureDocumentType(documentType: unknown): PatientDocumentType {
    const values = Object.values(PatientDocumentType);

    if (!values.includes(documentType as PatientDocumentType)) {
      throw ErrorModel.conflict({ detail: ClientErrorMessages.ERROR_PATIENT });
    }

    return documentType as PatientDocumentType;
  }

  private toSessionPayload(): SessionPayloadDTO {
    return {
      patient: {
        id: this.#id,
        fmpId: this.fmpId,
        nhcId: this.#nhcId,
        documentNumber: this.documentNumber,
        documentType: this.documentType,
        firstName: this.firstName,
        lastName: this.lastName,
        account: this.account ? { id: this.account.id } : undefined,
        device: this.#device ? { id: this.#device.id } : undefined,
      },
      external: {
        email: this.email,
        phone: this.phone,
      },
    };
  }
}
