/** Validation field limits and fallback paths */
export const ValidationLimits = {
  NAME_MAX: 100,
  TITLE_MAX: 200,
  EMAIL_MAX: 255,
} as const;

/** Fallback path when Zod error has no path (e.g. root body validation) */
export const VALIDATION_PATH_BODY = 'body';
