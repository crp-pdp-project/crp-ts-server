import { AsyncLocalStorage } from 'node:async_hooks';

import { DateHelper } from 'src/general/helpers/date.helper';

export type RequestContext = {
  requestId: string;
  requestMethod: string;
  requestUrl: string;
  startedAt: number;
};

export class RequestContextManager {
  private static readonly storage = new AsyncLocalStorage<RequestContext>();

  static enter(context: RequestContext): void {
    this.storage.enterWith(context);
  }

  static get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  static getLogContext(): Record<string, unknown> {
    const context = this.get();
    if (!context) return {};

    return {
      requestId: context.requestId,
      requestMethod: context.requestMethod,
      requestUrl: context.requestUrl,
    };
  }

  static getDurationMs(): number | undefined {
    const context = this.get();
    if (!context) return undefined;

    return DateHelper.toDate('none').valueOf() - context.startedAt;
  }
}
