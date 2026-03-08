/* eslint-disable n/no-sync */
import fs from 'fs';
import path from 'path';

import { DB_DATA_DIR, DbFilenames } from '../constants/db';

beforeEach(() => {
  const dbPath = path.join(process.cwd(), DB_DATA_DIR, DbFilenames.DEFAULT);
  const testDbPath = path.join(process.cwd(), DB_DATA_DIR, DbFilenames.TEST);
  fs.copyFileSync(dbPath, testDbPath);
});
