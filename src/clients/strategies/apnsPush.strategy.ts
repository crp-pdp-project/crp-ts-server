import { PushPayload, PushStrategy } from '../push.client';
import http2 from 'http2';
import { importPKCS8, SignJWT } from 'jose';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ApnsPushStrategy implements PushStrategy {
  private jwt: string = '';
  private jwtExp: string = '';
  private key: string = EnvHelper.get('APPLE_P8');
  private keyId: string = EnvHelper.get('APPLE_KEY_ID');
  private teamId: string = EnvHelper.get('APPLE_TEAM_ID');
  private hostUrl: string = EnvHelper.get('APPLE_HOST_URL');
  private bundleId: string = EnvHelper.get('APPLE_BUNDLE_ID');
  private session: http2.ClientHttp2Session | null = null;

  async sendPush(payload: PushPayload): Promise<void> {

  }

  private async getToken(): Promise<string> {
    if (DateHelper.checkExpired(this.jwtExp)) {
      const key = await importPKCS8(this.key, 'ES256');
      this.jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'ES256', kid: this.keyId })
        .setIssuer(this.teamId)
        .setIssuedAt()
        .setExpirationTime('50m')
        .sign(key);
      this.jwtExp = DateHelper.tokenRefreshTime(50);
    }

    return this.jwt;
  }

  private async getSession(): Promise<http2.ClientHttp2Session> {
    if (!this.session || this.session.destroyed) {
      this.session = http2.connect(this.hostUrl, {
        ALPNProtocols: ['h2'],
      });

      this.session.on('goaway', () => (this.session = null));
      this.session.on('error', () => (this.session = null));

      await new Promise<void>((resolve, reject) => {
        if(!this.session) return reject();

        this.session.once('connect', resolve);
        this.session.once('error', reject);
      });
    }

    return this.session;
  }

  private constructHeaders(token: string): http2.OutgoingHttpHeaders {
    const headers: http2.OutgoingHttpHeaders = {
      ':method': 'POST',
      ':path': `/3/device/${token}`,
      authorization: `bearer ${this.jwt}`,
      'apns-topic': this.bundleId,
      'apns-push-type': 'alert',
      'apns-priority': '10',
    };

    return headers;
  }
}
