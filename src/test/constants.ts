import { ApiPaths } from '@/constants/api';

/** Seed data IDs – must match src/data/db.json. New entities get UUIDs via services. */
export const SEED_IDS = {
  userAlice: '1',
  userBob: '2',
  userCarol: '3',
  post1: '1',
  post2: '2',
  post3: '3',
} as const;

/** Used in 404 tests – does not exist in db.json */
export const NON_EXISTENT_ID = '999';

/** API base path for route tests */
export const API_BASE = ApiPaths.BASE;
