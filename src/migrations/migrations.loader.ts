import fs from 'fs/promises';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

import { FileMigrationProvider } from 'kysely';

export class MigrationLoader {
  private readonly migrationFolder: string;

  constructor() {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

    this.migrationFolder = resolve(currentDir, './tasks');
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
}
