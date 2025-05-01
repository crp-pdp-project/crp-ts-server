export interface IJWTConfig {
  readonly secret: string;
  readonly issuer: string;
  readonly audience: string;
  readonly tokenExpTime: string;
  readonly SessionExpTime: number;
}

abstract class BaseJWTConfig implements IJWTConfig {
  readonly secret = process.env.JWT_SECRET ?? '';
  readonly issuer = 'crp-ts-server';
  abstract readonly audience: string;
  abstract readonly tokenExpTime: string;
  abstract readonly SessionExpTime: number;
}

export class JWTConfigSession extends BaseJWTConfig {
  readonly audience: string = 'app-usage';
  readonly tokenExpTime: string = '1y';
  readonly SessionExpTime: number = 15;
}

export class JWTConfigEnroll extends BaseJWTConfig {
  readonly audience: string = 'enroll-account';
  readonly tokenExpTime: string = '5m';
  readonly SessionExpTime: number = 5;
}

export class JWTConfigRecover extends BaseJWTConfig {
  readonly audience: string = 'reset-password';
  readonly tokenExpTime: string = '5m';
  readonly SessionExpTime: number = 5;
}
