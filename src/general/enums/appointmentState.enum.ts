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
  PAYED = 1,
  NOT_PAYED = 2,
}

export enum PayTextStates {
  PAYED = 'Pagado',
  NOT_PAYED = 'Pendiente de pago',
}

export class PayStatesMapper {
  private static readonly payStatesMap: Record<PayTextStates, PayStates> = {
    [PayTextStates.PAYED]: PayStates.PAYED,
    [PayTextStates.NOT_PAYED]: PayStates.NOT_PAYED,
  };
  static getPayState(state: string): PayStates {
    if (!(state in this.payStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid pay state: ${state}` });
    }
    return this.payStatesMap[state as PayTextStates];
  }
}

export enum CancelActionStates {
  UNPAYED_BEFORE_DEADLINE = 1,
  UNPAYED_AFTER_DEADLINE = 2,
  PAYED_BEFORE_DEADLINE = 3,
  PAYED_AFTER_DEADLINE = 4,
}

export enum CancelActionTextStates {
  UNPAYED_BEFORE_DEADLINE = 'A01',
  UNPAYED_AFTER_DEADLINE = 'A02',
  PAYED_BEFORE_DEADLINE = 'A03',
  PAYED_AFTER_DEADLINE = 'A04',
}

export class CancelActionStatesMapper {
  private static readonly cancelActionStatesMap: Record<CancelActionTextStates, CancelActionStates> = {
    [CancelActionTextStates.UNPAYED_BEFORE_DEADLINE]: CancelActionStates.UNPAYED_BEFORE_DEADLINE,
    [CancelActionTextStates.UNPAYED_AFTER_DEADLINE]: CancelActionStates.UNPAYED_AFTER_DEADLINE,
    [CancelActionTextStates.PAYED_BEFORE_DEADLINE]: CancelActionStates.PAYED_BEFORE_DEADLINE,
    [CancelActionTextStates.PAYED_AFTER_DEADLINE]: CancelActionStates.PAYED_AFTER_DEADLINE,
  };
  static getCancelState(state: string): CancelActionStates {
    if (!(state in this.cancelActionStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid cancel action state: ${state}` });
    }
    return this.cancelActionStatesMap[state as CancelActionTextStates];
  }
}

export enum RescheduleActionStates {
  ALLOWED_BEFORE_DEADLINE = 1,
  BLOCKED_AFTER_DEADLINE = 2,
  BLOCKED_ALREADY_RESCHEDULE = 3,
}

export enum RescheduleActionTextStates {
  ALLOWED_BEFORE_DEADLINE = 'R01',
  BLOCKED_AFTER_DEADLINE = 'R02',
  BLOCKED_ALREADY_RESCHEDULE = 'R03',
}

export class RescheduleActionStatesMapper {
  private static readonly rescheduleActionStatesMap: Record<RescheduleActionTextStates, RescheduleActionStates> = {
    [RescheduleActionTextStates.ALLOWED_BEFORE_DEADLINE]: RescheduleActionStates.ALLOWED_BEFORE_DEADLINE,
    [RescheduleActionTextStates.BLOCKED_AFTER_DEADLINE]: RescheduleActionStates.BLOCKED_AFTER_DEADLINE,
    [RescheduleActionTextStates.BLOCKED_ALREADY_RESCHEDULE]: RescheduleActionStates.BLOCKED_ALREADY_RESCHEDULE,
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
  BLOCKED = 2,
}

export enum PaymentActionTextStates {
  ALLOWED = 'P01',
  BLOCKED = 'P02',
}

export class PaymentActionStatesMapper {
  private static readonly paymentActionStatesMap: Record<PaymentActionTextStates, PaymentActionStates> = {
    [PaymentActionTextStates.ALLOWED]: PaymentActionStates.ALLOWED,
    [PaymentActionTextStates.BLOCKED]: PaymentActionStates.BLOCKED,
  };
  static getPaymentActionState(state: string): PaymentActionStates {
    if (!(state in this.paymentActionStatesMap)) {
      throw ErrorModel.badRequest({ message: `Invalid payment action state: ${state}` });
    }
    return this.paymentActionStatesMap[state as PaymentActionTextStates];
  }
}
