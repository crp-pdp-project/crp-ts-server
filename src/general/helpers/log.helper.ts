import { LogConstants } from 'src/general/contants/log.constants';
import { TextHelper } from 'src/general/helpers/text.helper';

type LogObject = Record<string, unknown>;

type ReducedArray = {
  sample: unknown;
  count: number;
  omitted: number;
};

type TruncatedValue = {
  preview: string;
  truncated: true;
  originalLength: number;
};

export class LogHelper {
  private static readonly sensitiveKeys = new Set<string>(LogConstants.SENSITIVE_KEYS);

  static safeContext(context: LogObject): LogObject {
    const processed = this.safeValue(context, undefined, new WeakSet<object>());
    if (!this.isLogObject(processed)) return {};

    const serialized = this.safeStringify(processed);
    if (serialized.length <= LogConstants.MAX_VALUE_LENGTH) return processed;

    return {
      ...this.extractRequestFields(processed),
      context: {
        preview: serialized.slice(0, LogConstants.MAX_VALUE_LENGTH),
        truncated: true,
        originalLength: serialized.length,
      },
    };
  }

  private static safeValue(value: unknown, key: string | undefined, seen: WeakSet<object>): unknown {
    switch (true) {
      case key !== undefined && this.isSensitiveKey(key):
        return LogConstants.REDACTED_VALUE;
      case typeof value === 'string':
        return this.truncateString(value);
      case typeof value !== 'object' || value === null:
        return value;
      case value instanceof Error:
        return this.safeError(value);
      case value instanceof Date:
        return value.toISOString();
      case Buffer.isBuffer(value):
        return this.safeBuffer(value);
    }

    if (seen.has(value)) return LogConstants.CIRCULAR_VALUE;
    seen.add(value);

    if (Array.isArray(value)) {
      const safeArray = this.safeArray(value, seen);
      seen.delete(value);
      return safeArray;
    }

    const entries = Object.entries(value as LogObject).map(([objectKey, objectValue]) => [
      objectKey,
      this.safeValue(objectValue, objectKey, seen),
    ]);

    seen.delete(value);
    return Object.fromEntries(entries) as LogObject;
  }

  private static safeArray(values: unknown[], seen: WeakSet<object>): ReducedArray {
    const [firstItem] = values;

    return {
      sample: values.length > 0 ? this.safeValue(firstItem, undefined, seen) : null,
      count: values.length,
      omitted: Math.max(values.length - 1, 0),
    };
  }

  private static safeError(error: Error): LogObject {
    return {
      name: error.name,
      message: this.truncateString(error.message),
      stack: error.stack ? this.truncateString(error.stack) : undefined,
    };
  }

  private static safeBuffer(buffer: Buffer): LogObject {
    return {
      type: 'Buffer',
      byteLength: buffer.byteLength,
    };
  }

  private static truncateString(value: string): string | TruncatedValue {
    const normalizedValue = TextHelper.compactWhitespace(value);
    if (normalizedValue.length <= LogConstants.MAX_VALUE_LENGTH) return normalizedValue;

    return {
      preview: normalizedValue.slice(0, LogConstants.MAX_VALUE_LENGTH),
      truncated: true,
      originalLength: normalizedValue.length,
    };
  }

  private static isSensitiveKey(key: string): boolean {
    return this.sensitiveKeys.has(this.normalizeKey(key));
  }

  private static normalizeKey(key: string): string {
    return Array.from(key.toLowerCase())
      .map((char) => (char === 'ñ' ? 'n' : char))
      .filter((char) => (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9'))
      .join('');
  }

  private static isLogObject(value: unknown): value is LogObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private static safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private static extractRequestFields(context: LogObject): LogObject {
    return ['requestId', 'requestMethod', 'requestUrl'].reduce<LogObject>((acc, key) => {
      const value = context[key];
      if (value !== undefined) acc[key] = value;

      return acc;
    }, {});
  }
}
