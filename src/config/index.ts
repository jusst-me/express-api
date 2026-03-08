import 'dotenv/config';

const parsePort = (): number => {
  const raw = process.env.PORT ?? '3000';
  const port = parseInt(raw, 10);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: "${raw}". Must be a number between 1 and 65535.`);
  }
  return port;
};

const parseCorsOrigin = (): string | string[] | boolean => {
  const raw = process.env.CORS_ORIGIN;
  if (raw === undefined || raw === '') return true;
  if (raw === '*') return true;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const parseRateLimitMax = (): number => {
  const raw = process.env.RATE_LIMIT_MAX ?? '100';
  const max = parseInt(raw, 10);
  if (Number.isNaN(max) || max < 1) {
    throw new Error(`Invalid RATE_LIMIT_MAX: "${raw}". Must be a positive number.`);
  }
  return max;
};

export const config = {
  port: parsePort(),
  corsOrigin: parseCorsOrigin(),
  rateLimitMax: parseRateLimitMax(),
};
