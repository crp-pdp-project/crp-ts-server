import { Kysely, MysqlDialect, ErrorLogEvent, QueryLogEvent, MysqlPool } from 'kysely';
import { createPool } from 'mysql2';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { FamilyDM } from 'src/app/entities/dms/families.dm';
import { HealthInsurancesDM } from 'src/app/entities/dms/healthInsurances.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PushConfigDM } from 'src/app/entities/dms/pushConfigs.dm';
import { RelationshipDM } from 'src/app/entities/dms/relationships.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { LoggerClient } from 'src/clients/logger.client';
import { EnvHelper } from 'src/general/helpers/env.helper';

export interface Database {
  Patients: PatientDM;
  Accounts: AccountDM;
  Sessions: SessionDM;
  Families: FamilyDM;
  Relationships: RelationshipDM;
  AuthAttempts: AuthAttemptDM;
  PushConfigs: PushConfigDM;
  Devices: DeviceDM;
  HealthInsurances: HealthInsurancesDM;
}

class KyselyLogger {
  private static readonly logger = LoggerClient.instance;

  static logQuery(event: QueryLogEvent): void {
    this.logger.info('SQL Query Executed', {
      query: event.query.sql,
      parameters: event.query.parameters,
    });
  }

  static logQueryError(event: ErrorLogEvent): void {
    this.logger.error('SQL Query Failed', {
      query: event.query.sql,
      parameters: event.query.parameters,
      error: event.error,
    });
  }
}

export class MysqlClient {
  static readonly instance: MysqlClient = new MysqlClient();
  private readonly db: Kysely<Database>;

  private constructor() {
    const dialect = new MysqlDialect({
      pool: createPool({
        host: EnvHelper.get('DB_HOST'),
        user: EnvHelper.get('DB_USER'),
        password: EnvHelper.get('DB_PASSWORD'),
        database: EnvHelper.get('DB_NAME'),
        port: Number(EnvHelper.get('DB_PORT')),
        connectionLimit: 10,
      }) as MysqlPool,
    });

    this.db = new Kysely<Database>({
      dialect,
      log(event) {
        switch (event.level) {
          case 'query':
            KyselyLogger.logQuery(event);
            break;
          case 'error':
            KyselyLogger.logQueryError(event);
            break;
        }
      },
    });
  }

  getDb(): Kysely<Database> {
    return this.db;
  }
}
