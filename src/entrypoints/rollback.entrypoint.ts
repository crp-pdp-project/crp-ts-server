import 'dotenv/config';

import { Migrator, Kysely } from 'kysely';

import { LoggerClient } from 'src/clients/logger/logger.client';
import { Database, MysqlClient } from 'src/clients/mysql/mysql.client';
import { MigrationLoader } from 'src/migrations/migrations.loader';

export class Rollback {
  private static readonly db: Kysely<Database> = MysqlClient.instance.getDb();
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly migrationLoader: MigrationLoader = new MigrationLoader();

  static async start(): Promise<void> {
    try {
      await this.rollbackAll();
    } finally {
      await this.close();
    }
  }

  private static async rollbackAll(): Promise<void> {
    this.logger.info('Rolling back all migrations...');

    const migrator = new Migrator({
      db: this.db,
      provider: this.migrationLoader.getProvider(),
    });

    const migrations = await migrator.getMigrations();
    const appliedMigrations = migrations.filter((migration) => migration.executedAt);

    for (const _ of appliedMigrations) {
      const { error, results: [result] = [] } = await migrator.migrateDown();

      if (!result) {
        this.logger.info('No more migrations to rollback.');
        break;
      }

      if (result.status === 'Success') {
        this.logger.info(`Rolled back "${result.migrationName}" successfully`);
      } else if (result.status === 'Error') {
        this.logger.error(`Failed to rollback "${result.migrationName}"`, { result });
      }

      if (error) {
        if (error instanceof Error) this.logger.error('Rollback process failed:', { error });
        process.exit(1);
      }
    }

    this.logger.info('All migrations have been rolled back.');
  }

  private static async close(): Promise<void> {
    await this.db.destroy();
  }
}

void Rollback.start();
