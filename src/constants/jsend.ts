/** JSend response status values – https://github.com/omniti-labs/jsend */
export const JSendStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const;

export type JSendStatusValue = (typeof JSendStatus)[keyof typeof JSendStatus];
