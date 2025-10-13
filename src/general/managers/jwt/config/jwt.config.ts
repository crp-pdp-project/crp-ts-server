import { Audiences } from 'src/general/enums/audience.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';

export interface IJWTConfig {
  readonly secret: string;
  readonly issuer: string;
  readonly audience: Audiences;
  readonly tokenExpTime: string;
  readonly SessionExpTime: number;
}

abstract class BaseJWTConfig implements IJWTConfig {
  readonly secret = EnvHelper.get('JWT_SECRET');
  readonly issuer = 'crp-ts-server';
  abstract readonly audience: Audiences;
  abstract readonly tokenExpTime: string;
  abstract readonly SessionExpTime: number;
}

export class JWTConfigSession extends BaseJWTConfig {
  readonly audience = Audiences.SIGN_IN;
  readonly tokenExpTime = '1y';
  readonly SessionExpTime = 15;
}

export class JWTConfigEmployee extends BaseJWTConfig {
  readonly audience = Audiences.EMPLOYEE_SIGN_IN;
  readonly tokenExpTime = '1y';
  readonly SessionExpTime = 15;
}

export class JWTConfigEnroll extends BaseJWTConfig {
  readonly audience = Audiences.ENROLL;
  readonly tokenExpTime = '5m';
  readonly SessionExpTime = 5;
}

export class JWTConfigRecover extends BaseJWTConfig {
  readonly audience = Audiences.RECOVER;
  readonly tokenExpTime = '5m';
  readonly SessionExpTime = 5;
}
