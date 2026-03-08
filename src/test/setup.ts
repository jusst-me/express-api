/* eslint-disable n/no-sync */
import fs from 'fs';
import path from 'path';

beforeEach(() => {
  const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
  const testDbPath = path.join(process.cwd(), 'src', 'data', 'db.test.json');
  fs.copyFileSync(dbPath, testDbPath);
});
