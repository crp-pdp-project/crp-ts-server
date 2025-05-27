import { ErrorModel } from 'src/app/entities/models/error.model';

export class EnvHelper {
  static get(key: keyof NodeJS.ProcessEnv): string {
    const value = process.env[key];
    if (!value) {
      throw ErrorModel.server({ message: `Env ${key} Not found` });
    }
    return value;
  }
}
