/* eslint-disable n/no-sync */
import fs from 'fs';
import path from 'path';

import type { DbSchema } from '../types';

const getDbPath = (): string => {
  const filename = process.env.NODE_ENV === 'test' ? 'db.test.json' : 'db.json';
  return path.join(process.cwd(), 'src', 'data', filename);
};

export const getDbPathForTests = (): string => getDbPath();

export const readDb = (dbPath?: string): DbSchema => {
  const filePath = dbPath ?? getDbPath();
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as DbSchema;
};

export const writeDb = (data: DbSchema, dbPath?: string): void => {
  const filePath = dbPath ?? getDbPath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
