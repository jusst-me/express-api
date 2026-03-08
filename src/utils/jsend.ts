import type { Response } from 'express';

import { HttpStatus } from '../constants/http';
import { JSendStatus } from '../constants/jsend';

/**
 * JSend response helpers – https://github.com/omniti-labs/jsend
 * All API responses use this format for consistency.
 */

export const success = (res: Response, data: unknown, statusCode: number = HttpStatus.OK): void => {
  res.status(statusCode).json({ status: JSendStatus.SUCCESS, data });
};

export const fail = (
  res: Response,
  data: Record<string, unknown>,
  statusCode: number = HttpStatus.BAD_REQUEST
): void => {
  res.status(statusCode).json({ status: JSendStatus.FAIL, data });
};

export const error = (
  res: Response,
  message: string,
  options?: { code?: number; data?: Record<string, unknown> }
): void => {
  const statusCode = options?.code ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const body: { status: 'error'; message: string; code?: number; data?: Record<string, unknown> } =
    { status: JSendStatus.ERROR as 'error', message };
  if (options?.code !== undefined) body.code = options.code;
  if (options?.data !== undefined && Object.keys(options.data).length > 0) body.data = options.data;
  res.status(statusCode).json(body);
};
