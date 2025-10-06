import { ErrorModel } from 'src/app/entities/models/error/error.model';

export enum AppointmentStates {
  PROGRAMMED = 1,
  FINISHED = 2,
  CANCELED = 3,
}

export enum AppointmentTextStates {
  PROGRAMMED = 'Citado',
  FINISHED = 'Cerrado',
  CANCELED = 'Anulado',
}

export class AppointmentStatesMapper {
  private static readonly appointmentStatesMap: Record<AppointmentTextStates, AppointmentStates> = {
    [AppointmentTextStates.PROGRAMMED]: AppointmentStates.PROGRAMMED,
    [AppointmentTextStates.FINISHED]: AppointmentStates.FINISHED,
    [AppointmentTextStates.CANCELED]: AppointmentStates.CANCELED,
  };
  static getAppointmentState(state: string): AppointmentStates {
    if (!(state in this.appointmentStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid appointment state: ${state}` });
    }
    return this.appointmentStatesMap[state as AppointmentTextStates];
  }
}

export enum PayStates {
  NOT_PAYED = 1,
  PAYED = 2,
}

export enum PayTextStates {
  NOT_PAYED = 'Pendiente de pago',
  PAYED = 'Pagado',
}

export class PayStatesMapper {
  private static readonly payStatesMap: Record<PayTextStates, PayStates> = {
    [PayTextStates.NOT_PAYED]: PayStates.NOT_PAYED,
    [PayTextStates.PAYED]: PayStates.PAYED,
  };
  static getPayState(state: string): PayStates {
    if (!(state in this.payStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid pay state: ${state}` });
    }
    return this.payStatesMap[state as PayTextStates];
  }
}

export enum CancelActionStates {
  ALLOWED = 1,
  ALLOWED_AFTER_DEADLINE = 2,
  ALLOWED_PAYED_BEFORE_DEADLINE = 3,
  BLOCKED = 4,
}

export enum CancelActionTextStates {
  ALLOWED = 'A01',
  ALLOWED_AFTER_DEADLINE = 'A02',
  ALLOWED_PAYED_BEFORE_DEADLINE = 'A03',
  BLOCKED = 'A04',
}

export class CancelActionStatesMapper {
  private static readonly cancelActionStatesMap: Record<CancelActionTextStates, CancelActionStates> = {
    [CancelActionTextStates.ALLOWED]: CancelActionStates.ALLOWED,
    [CancelActionTextStates.ALLOWED_AFTER_DEADLINE]: CancelActionStates.ALLOWED_AFTER_DEADLINE,
    [CancelActionTextStates.ALLOWED_PAYED_BEFORE_DEADLINE]: CancelActionStates.ALLOWED_PAYED_BEFORE_DEADLINE,
    [CancelActionTextStates.BLOCKED]: CancelActionStates.BLOCKED,
  };
  static getCancelState(state: string): CancelActionStates {
    if (!(state in this.cancelActionStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid cancel action state: ${state}` });
    }
    return this.cancelActionStatesMap[state as CancelActionTextStates];
  }
}

export enum RescheduleActionStates {
  ALLOWED = 1,
  DISABLED_AFTER_DEADLINE = 2,
  DISABLED_ALREADY_RESCHEDULE = 3,
  BLOCKED = 4,
}

export enum RescheduleActionTextStates {
  ALLOWED = 'R01',
  DISABLED_AFTER_DEADLINE = 'R02',
  DISABLED_ALREADY_RESCHEDULE = 'R03',
  BLOCKED = 'R04',
}

export class RescheduleActionStatesMapper {
  private static readonly rescheduleActionStatesMap: Record<RescheduleActionTextStates, RescheduleActionStates> = {
    [RescheduleActionTextStates.ALLOWED]: RescheduleActionStates.ALLOWED,
    [RescheduleActionTextStates.DISABLED_ALREADY_RESCHEDULE]: RescheduleActionStates.DISABLED_ALREADY_RESCHEDULE,
    [RescheduleActionTextStates.DISABLED_AFTER_DEADLINE]: RescheduleActionStates.DISABLED_AFTER_DEADLINE,
    [RescheduleActionTextStates.BLOCKED]: RescheduleActionStates.BLOCKED,
  };
  static getRescheduleActionState(state: string): RescheduleActionStates {
    if (!(state in this.rescheduleActionStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid reschedule action state: ${state}` });
    }
    return this.rescheduleActionStatesMap[state as RescheduleActionTextStates];
  }
}

export enum PaymentActionStates {
  ALLOWED = 1,
  DISABLED = 2,
  ALREADY_PAYED = 3,
  BLOCKED = 4,
}

export enum PaymentActionTextStates {
  ALLOWED = 'P01',
  DISABLED = 'P02',
  ALREADY_PAYED = 'P03',
  BLOCKED = 'P04',
}

export class PaymentActionStatesMapper {
  private static readonly paymentActionStatesMap: Record<PaymentActionTextStates, PaymentActionStates> = {
    [PaymentActionTextStates.ALLOWED]: PaymentActionStates.ALLOWED,
    [PaymentActionTextStates.DISABLED]: PaymentActionStates.DISABLED,
    [PaymentActionTextStates.ALREADY_PAYED]: PaymentActionStates.ALREADY_PAYED,
    [PaymentActionTextStates.BLOCKED]: PaymentActionStates.BLOCKED,
  };
  static getPaymentActionState(state: string): PaymentActionStates {
    if (!(state in this.paymentActionStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid payment action state: ${state}` });
    }
    return this.paymentActionStatesMap[state as PaymentActionTextStates];
  }
}
