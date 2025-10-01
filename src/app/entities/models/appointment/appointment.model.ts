import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import {
  AppointmentStates,
  PayStates,
  CancelActionStates,
  RescheduleActionStates,
  PaymentActionStates,
  AppointmentStatesMapper,
  CancelActionStatesMapper,
  RescheduleActionStatesMapper,
  PaymentActionStatesMapper,
  PayStatesMapper,
} from 'src/general/enums/appointmentState.enum';
import { TipsType, TipsTypeUtils } from 'src/general/enums/tipsTypes.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { AppointmentDocumentModel } from '../appointmentDocument/appointmentDocument.model';
import { AppointmentDocumentListModel } from '../appointmentDocument/appointmentDocumentList.model';
import { AppointmentTypeModel } from '../appointmentType/appointmentType.model';
import { BaseModel } from '../base.model';
import { DoctorModel } from '../doctor/doctor.model';
import { InsuranceModel } from '../insurance/insurance.model';
import { SpecialtyModel } from '../specialty/specialty.model';
import { TipModel } from '../tip/tip.model';

export class AppointmentModel extends BaseModel {
  readonly id?: string;
  readonly episodeId?: string;
  readonly date?: string;
  readonly status?: AppointmentStates;
  readonly mode?: string;
  readonly doctor?: DoctorModel;
  readonly specialty?: SpecialtyModel;
  readonly insurance?: InsuranceModel;
  readonly appointmentType?: AppointmentTypeModel;
  readonly cancelAction?: CancelActionStates;
  readonly rescheduleAction?: RescheduleActionStates;
  readonly payAction?: PaymentActionStates;
  readonly payState?: PayStates;

  #tips?: TipModel[];
  #documents?: AppointmentDocumentModel[];

  constructor(appointment: AppointmentDTO) {
    super();

    this.id = appointment.id;
    this.episodeId = appointment.episodeId;
    this.date = appointment.date ? DateHelper.toFormatDateTime(appointment.date, 'spanishDateTime') : undefined;
    this.mode = appointment.mode ?? undefined;
    this.doctor = appointment.doctor ? new DoctorModel(appointment.doctor) : undefined;
    this.specialty = appointment.specialty ? new SpecialtyModel(appointment.specialty) : undefined;
    this.insurance = appointment.insurance ? new InsuranceModel(appointment.insurance) : undefined;
    this.appointmentType = appointment.appointmentType
      ? new AppointmentTypeModel(appointment.appointmentType)
      : undefined;
    this.status = appointment.status ? AppointmentStatesMapper.getAppointmentState(appointment.status) : undefined;
    this.cancelAction = appointment.cancelAction
      ? CancelActionStatesMapper.getCancelState(appointment.cancelAction)
      : undefined;
    this.rescheduleAction = appointment.rescheduleAction
      ? RescheduleActionStatesMapper.getRescheduleActionState(appointment.rescheduleAction)
      : undefined;
    this.payAction = appointment.payAction
      ? PaymentActionStatesMapper.getPaymentActionState(appointment.payAction)
      : undefined;
    this.payState = appointment.payState ? PayStatesMapper.getPayState(appointment.payState) : undefined;
    this.#tips = this.resolveDefaultTips();
  }

  get tips(): TipModel[] | undefined {
    return this.#tips;
  }

  get documents(): AppointmentDocumentModel[] | undefined {
    return this.#documents;
  }

  overrideTips(type: TipsType): this {
    const tips = TipsTypeUtils.getTipsByType(type);
    this.#tips = tips.map((tip) => new TipModel(tip));

    return this;
  }

  inyectDocuments(documentList: AppointmentDocumentListModel): this {
    this.#documents = documentList.documents;

    return this;
  }

  private resolveDefaultTips(): TipModel[] | undefined {
    const defaultTipsMap: Record<PaymentActionStates, TipsType> = {
      [PaymentActionStates.ALLOWED]: TipsType.DEFAULT,
      [PaymentActionStates.BLOCKED]: TipsType.PAY_DEADLINE,
    };

    const tips = this.payAction ? TipsTypeUtils.getTipsByType(defaultTipsMap[this.payAction]) : undefined;

    return tips?.map((tip) => new TipModel(tip));
  }
}
