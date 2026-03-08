/* eslint-disable n/no-sync */
import fs from 'fs';
import path from 'path';

import { DB_DATA_DIR, DbFilenames } from '../constants/db';
import type { DbSchema } from '../types';
import { NON_EXISTENT_ID, SEED_IDS } from './constants';

describe('test constants', () => {
  it('db.json seed IDs match SEED_IDS constants', () => {
    const dbPath = path.join(process.cwd(), DB_DATA_DIR, DbFilenames.DEFAULT);
    const content = fs.readFileSync(dbPath, 'utf-8');
    const db: DbSchema = JSON.parse(content);

    expect(db.users[0].id).toBe(SEED_IDS.userAlice);
    expect(db.users[1].id).toBe(SEED_IDS.userBob);
    expect(db.users[2].id).toBe(SEED_IDS.userCarol);

    expect(db.posts[0].id).toBe(SEED_IDS.post1);
    expect(db.posts[0].userId).toBe(SEED_IDS.userAlice);
    expect(db.posts[1].id).toBe(SEED_IDS.post2);
    expect(db.posts[1].userId).toBe(SEED_IDS.userAlice);
    expect(db.posts[2].id).toBe(SEED_IDS.post3);
    expect(db.posts[2].userId).toBe(SEED_IDS.userBob);
  });

  it('NON_EXISTENT_ID is not in db.json', () => {
    const dbPath = path.join(process.cwd(), DB_DATA_DIR, DbFilenames.DEFAULT);
    const content = fs.readFileSync(dbPath, 'utf-8');
    const db: DbSchema = JSON.parse(content);

    const allIds = [
      ...db.users.map((u) => u.id),
      ...db.posts.map((p) => p.id),
      ...db.posts.map((p) => p.userId),
    ];
    expect(allIds).not.toContain(NON_EXISTENT_ID);
  });
});
