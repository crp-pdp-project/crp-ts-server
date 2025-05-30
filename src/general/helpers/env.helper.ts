import { Environments } from '../enums/environments.enum';
import { LogLevels } from '../enums/logLevels.enum';

export class EnvHelper {
  static get(key: keyof NodeJS.ProcessEnv): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Env variable '${key}' not found`);
    }
    return value;
  }

  static getCurrentEnv(): Environments {
    const rawValue = process.env.NODE_ENV;

    if (!rawValue) {
      throw new Error('NODE_ENV not found');
    }

    const value = rawValue.toLowerCase();

    if (!Object.values(Environments).includes(value as Environments)) {
      throw new Error(`NODE_ENV value '${value}' is invalid`);
    }

    return value as Environments;
  }

  static getCurrentLogLevel(): LogLevels {
    const rawValue = process.env.LOG_LEVEL;

    if (!rawValue) {
      return LogLevels.INFO;
    }

    const value = rawValue.toLowerCase();

    if (!Object.values(LogLevels).includes(value as LogLevels)) {
      throw new Error(`LOG_LEVEL value '${value}' is invalid`);
    }

    return value as LogLevels;
  }
}
