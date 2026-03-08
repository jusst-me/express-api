import fs from 'fs/promises';
import path from 'path';

import type { DbSchema } from '../types';

const getDbPath = (): string => {
  const filename = process.env.NODE_ENV === 'test' ? 'db.test.json' : 'db.json';
  return path.join(process.cwd(), 'src', 'data', filename);
};

export const getDbPathForTests = (): string => getDbPath();

export const readDb = async (dbPath?: string): Promise<DbSchema> => {
  const filePath = dbPath ?? getDbPath();
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as DbSchema;
};

export const writeDb = async (data: DbSchema, dbPath?: string): Promise<void> => {
  const filePath = dbPath ?? getDbPath();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
