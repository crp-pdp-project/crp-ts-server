import { Environments } from '../enums/Environments.enum';
import { LogLevels } from '../enums/logLevels.enum';

export class EnvHelper {
  static get(key: keyof NodeJS.ProcessEnv): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Env ${key} Not found`);
    }
    return value;
  }

  static getCurrentEnv(): Environments {
    const value = process.env.NODE_ENV as Environments;
    if (!value) {
      throw new Error('NODE_ENV Not found');
    }

    if (!Object.values(Environments).includes(value)) {
      throw new Error(`NODE_ENV value '${value}' is invalid`);
    }

    return value;
  }

  static getCurrentLogLevel(): LogLevels {
    const value = process.env.LOG_LEVEL as LogLevels;

    if (!value) {
      return LogLevels.INFO;
    }

    if (!Object.values(LogLevels).includes(value)) {
      throw new Error(`LOG_LEVEL value '${value}' is invalid`);
    }

    return value;
  }
}
