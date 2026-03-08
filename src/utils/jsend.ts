import type { Response } from 'express';

/**
 * JSend response helpers – https://github.com/omniti-labs/jsend
 * All API responses use this format for consistency.
 */

export const success = (res: Response, data: unknown, statusCode = 200): void => {
  res.status(statusCode).json({ status: 'success', data });
};

export const fail = (res: Response, data: Record<string, unknown>, statusCode = 400): void => {
  res.status(statusCode).json({ status: 'fail', data });
};

export const error = (
  res: Response,
  message: string,
  options?: { code?: number; data?: Record<string, unknown> }
): void => {
  const statusCode = options?.code ?? 500;
  const body: { status: 'error'; message: string; code?: number; data?: Record<string, unknown> } =
    { status: 'error', message };
  if (options?.code !== undefined) body.code = options.code;
  if (options?.data !== undefined && Object.keys(options.data).length > 0) body.data = options.data;
  res.status(statusCode).json(body);
};
