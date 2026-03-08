import dotenv from 'dotenv';

import { ApiPaths } from '@/constants/api';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

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

const parseApiServerUrl = (port: number): string => {
  const base = process.env.API_BASE_URL;
  if (base) {
    return `${base.replace(/\/$/, '')}${ApiPaths.BASE}`;
  }
  const host = process.env.HOST ?? 'localhost';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${host}:${port}${ApiPaths.BASE}`;
};

const port = parsePort();

export const config = {
  port,
  corsOrigin: parseCorsOrigin(),
  rateLimitMax: parseRateLimitMax(),
  apiServerUrl: parseApiServerUrl(port),
};
