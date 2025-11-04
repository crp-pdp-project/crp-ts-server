import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path, { resolve } from 'node:path';

import { FileMigrationProvider } from 'kysely';

import { LoggerClient } from 'src/clients/logger/logger.client';

export class MigrationLoader {
  private readonly logger: LoggerClient = LoggerClient.instance;
  private readonly migrationFolder: string;

  constructor() {
    this.migrationFolder = this.resolveMigrationFolder();
  }

  getFolder(): string {
    return this.migrationFolder;
  }

  getProvider(): FileMigrationProvider {
    return new FileMigrationProvider({
      fs,
      path,
      migrationFolder: this.migrationFolder,
    });
  }

  resolveMigrationFolder(): string {
    const possibleLocations = [
      resolve(process.cwd(), 'tasks'),
      resolve(process.cwd(), 'dist', 'tasks'),
      resolve(process.cwd(), 'src', 'migrations', 'tasks'),
    ];

    const foundLocation = possibleLocations.find((location) => existsSync(location));

    this.logger.info('Found location', { location: foundLocation ?? null });

    return foundLocation ?? '';
  }
}
