import { existsSync } from 'fs';
import fs from 'fs/promises';
import path, { resolve } from 'path';

import { FileMigrationProvider } from 'kysely';

export class MigrationLoader {
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
      resolve(process.cwd(), 'src', 'migrations', 'tasks'),
    ];

    return possibleLocations.find((location) => existsSync(location)) ?? '';
  }
}
