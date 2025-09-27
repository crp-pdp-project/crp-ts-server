import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  EnrollSessionPayloadDTO,
  EnrollSessionPayloadDTOSchema,
} from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import {
  RecoverSessionPayloadDTO,
  RecoverSessionPayloadDTOSchema,
} from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

import { DeviceDM } from '../../dms/devices.dm';
import { AccountModel } from '../account/account.model';
import { DeviceModel } from '../device/device.model';
import { ErrorModel } from '../error/error.model';

export class PatientExternalModel extends BaseModel {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string | null;
  readonly maskedEmail?: string | null;
  readonly phone?: string | null;
  readonly maskedPhone?: string | null;
  readonly fmpId?: string;
  readonly nhcId?: string | null;
  readonly documentNumber?: string;
  readonly documentType?: number;
  readonly account?: AccountModel;

  readonly #searchResult: PatientExternalDTO;
  readonly #secondLastName?: string | null;
  readonly #birthDate?: string;
  #id?: number;
  #device?: DeviceModel;

  constructor(external: PatientExternalDTO, patient?: PatientDTO) {
    super();

    this.#id = patient?.id;
    this.email = external.email;
    this.maskedEmail = TextHelper.maskEmail(external.email);
    this.phone = TextHelper.normalizePhoneNumber(external.phone);
    this.maskedPhone = TextHelper.maskPhone(external.phone);
    this.firstName = TextHelper.titleCase(external.firstName) ?? '';
    this.lastName = TextHelper.titleCase(external.lastName) ?? '';
    this.#secondLastName = external.secondLastName ? TextHelper.titleCase(external.secondLastName)! : null;
    this.#birthDate = external.birthDate ? DateHelper.toFormatDate(external.birthDate, 'dbDate') : undefined;
    this.fmpId = external.fmpId;
    this.documentNumber = external.documentNumber;
    this.nhcId = external.nhcId;
    this.documentType = external.documentType;
    this.account = patient?.account ? new AccountModel(patient.account) : undefined;
    this.#searchResult = external;
  }

  get id(): number | undefined {
    return this.#id;
  }

  get device(): DeviceModel | undefined {
    return this.#device;
  }

  validateCenter(): void {
    if (this.#searchResult.centerId !== CRPConstants.CENTER_ID) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }
  }

  validatePatient(): void {
    this.validateCenter();
    if (!this.email && !this.phone) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.UNPROCESSABLE_PATIENT });
    }
  }

  hasPersistedPatient(): boolean {
    return !!this.#id;
  }

  hasValidAccount(): boolean {
    return !!this.#id && !!this.account;
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
      nhcId: this.nhcId,
      firstName: this.firstName,
      lastName: this.lastName,
      secondLastName: this.#secondLastName,
      birthDate: this.#birthDate,
      documentNumber: this.documentNumber,
      documentType: this.documentType,
    };
  }

  getRawSearchResult(): PatientExternalDTO {
    return this.#searchResult;
  }

  private toSessionPayload(): SessionPayloadDTO {
    return {
      patient: {
        id: this.#id,
        fmpId: this.fmpId,
        nhcId: this.nhcId,
        documentNumber: this.documentNumber,
        documentType: this.documentType,
        firstName: this.firstName,
        lastName: this.lastName,
        account: this.account ? { id: this.account.id } : undefined,
        device: this.#device ? { id: this.#device.id } : undefined,
      },
      external: {
        email: this.email ?? null,
        phone: this.phone ?? null,
      },
    };
  }
}
