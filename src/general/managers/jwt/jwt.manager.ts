import { randomUUID } from 'crypto';

import { jwtDecrypt, JWTPayload, EncryptJWT } from 'jose';

import { DateHelper } from 'src/general/helpers/date.helper';
import {
  IJWTConfig,
  JWTConfigEnroll,
  JWTConfigRecover,
  JWTConfigSession,
} from 'src/general/managers/jwt/config/jwt.config';

export type EnrichedPayload<T> = T & Required<Pick<JWTPayload, 'jti'>> & JWTPayload;
export type GenerationResponse = {
  jwt: string;
  jti: string;
  expiresAt: string;
};

export type ValidationResponse<T> = {
  newExpireAt: string;
  payload: EnrichedPayload<T>;
};
export interface IJWTManager<T extends JWTPayload> {
  generateToken(payload?: T): Promise<GenerationResponse>;
  verifyToken(token: string): Promise<ValidationResponse<T>>;
}

export class JWTManager<T extends JWTPayload> implements IJWTManager<T> {
  private readonly encryptionKey: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly tokenExpTime: string;
  private readonly sessionExpTime: number;

  constructor(jwtConfig: IJWTConfig) {
    this.encryptionKey = new TextEncoder().encode(jwtConfig.secret);
    this.issuer = jwtConfig.issuer;
    this.audience = jwtConfig.audience;
    this.tokenExpTime = jwtConfig.tokenExpTime;
    this.sessionExpTime = jwtConfig.SessionExpTime;
  }

  async generateToken(payload?: T): Promise<GenerationResponse> {
    const jti = randomUUID();
    const expiresAt = DateHelper.addMinutes(this.sessionExpTime, 'dbDateTime');

    const jwt = await new EncryptJWT(payload ?? {})
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
      .setIssuedAt()
      .setJti(jti)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(this.tokenExpTime)
      .encrypt(this.encryptionKey);

    return { jwt, jti, expiresAt };
  }

  async verifyToken(token: string): Promise<ValidationResponse<T>> {
    const { payload } = await jwtDecrypt(token, this.encryptionKey, {
      issuer: this.issuer,
      audience: this.audience,
    });

    const newExpireAt = DateHelper.addMinutes(this.sessionExpTime, 'dbDateTime');

    return {
      newExpireAt,
      payload: payload as EnrichedPayload<T>,
    };
  }
}

export class JWTManagerBuilder {
  static buildEnrollConfig<T extends JWTPayload>(): JWTManager<T> {
    return new JWTManager<T>(new JWTConfigEnroll());
  }

  static buildRecoverConfig<T extends JWTPayload>(): JWTManager<T> {
    return new JWTManager<T>(new JWTConfigRecover());
  }

  static buildSessionConfig<T extends JWTPayload>(): JWTManager<T> {
    return new JWTManager<T>(new JWTConfigSession());
  }
}
