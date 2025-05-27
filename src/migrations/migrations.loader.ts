import { existsSync } from 'fs';
import fs from 'fs/promises';
import path, { resolve } from 'path';

import { FileMigrationProvider } from 'kysely';
import { LoggerClient } from 'src/clients/logger.client';

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

    this.logger.info('Found location', { location: foundLocation ?? null })

    return foundLocation ?? '';
  }
}
