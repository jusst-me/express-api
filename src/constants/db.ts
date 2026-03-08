/** Database file names – db.service selects based on NODE_ENV */
export const DbFilenames = {
  DEFAULT: 'db.json',
  TEST: 'db.test.json',
} as const;

/** Relative path to data directory (from project root) */
export const DB_DATA_DIR = 'src/data';
