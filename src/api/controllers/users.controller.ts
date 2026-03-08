import type { NextFunction, Request, Response } from 'express';

import { ErrorMessages } from '@/constants/errors';
import { HttpStatus } from '@/constants/http';
import { VALIDATION_PATH_BODY } from '@/constants/validation';
import * as usersService from '@/services/users.service';
import { ValidationError } from '@/utils/errors';
import { success } from '@/utils/jsend';
import { userCreateSchema, userUpdateSchema } from '@/utils/validation';

export const list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await usersService.findAll();
    success(res, users);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await usersService.findById(id);
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const posts = await usersService.findPostsByUserId(id);
    success(res, posts);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = userCreateSchema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => e.message).join('; ');
      const details = result.error.errors.map((e) => ({
        path: e.path.join('.') || VALIDATION_PATH_BODY,
        message: e.message,
      }));
      throw new ValidationError(`Invalid user: ${msg}`, details);
    }
    const user = await usersService.create(result.data);
    success(res, user, HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = userUpdateSchema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => e.message).join('; ');
      const details = result.error.errors.map((e) => ({
        path: e.path.join('.') || VALIDATION_PATH_BODY,
        message: e.message,
      }));
      throw new ValidationError(`Invalid user: ${msg}`, details);
    }
    const id = req.params.id as string;
    if (result.data.id !== id) {
      throw new ValidationError(ErrorMessages.USER_ID_MISMATCH);
    }
    const user = await usersService.update(id, result.data);
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await usersService.remove(id);
    success(res, null);
  } catch (err) {
    next(err);
  }
};
