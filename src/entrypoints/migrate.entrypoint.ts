import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { resolve } from 'path';

import { Migrator, FileMigrationProvider, Kysely } from 'kysely';

import { LoggerClient } from 'src/clients/logger.client';
import { Database, MysqlClient } from 'src/clients/mysql.client';

export class Migrate {
  private static readonly db: Kysely<Database> = MysqlClient.instance.getDb();
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly migrationFolder: string = resolve(__dirname, './migrations');

  static async start(): Promise<void> {
    try {
      await this.migrateToLatest();
    } finally {
      await this.close();
    }
  }

  private static async migrateToLatest(): Promise<void> {
    this.logger.info('Starting database migrations...');

    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: this.migrationFolder,
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((result) => {
      if (result.status === 'Success') {
        this.logger.info(`Migration "${result.migrationName}" ran successfully`);
      } else if (result.status === 'Error') {
        this.logger.error(`Failed migration "${result.migrationName}"`, { result });
      }
    });

    if (error) {
      if (error instanceof Error) this.logger.error('Migration process failed:', { error });
      process.exit(1);
    }

    this.logger.info('Database is up to date.');
  }

  private static async close(): Promise<void> {
    await this.db.destroy();
  }
}

void Migrate.start();
