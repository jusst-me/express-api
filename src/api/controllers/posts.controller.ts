import type { NextFunction, Request, Response } from 'express';

import { ErrorMessages } from '@/constants/errors';
import { HttpStatus } from '@/constants/http';
import { VALIDATION_PATH_BODY } from '@/constants/validation';
import * as postsService from '@/services/posts.service';
import { ValidationError } from '@/utils/errors';
import { success } from '@/utils/jsend';
import { postCreateSchema, postUpdateSchema } from '@/utils/validation';

export const list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await postsService.findAll();
    success(res, posts);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const post = await postsService.findById(id);
    success(res, post);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = postCreateSchema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => e.message).join('; ');
      const details = result.error.errors.map((e) => ({
        path: e.path.join('.') || VALIDATION_PATH_BODY,
        message: e.message,
      }));
      throw new ValidationError(`Invalid post: ${msg}`, details);
    }
    const post = await postsService.create(result.data);
    success(res, post, HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = postUpdateSchema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => e.message).join('; ');
      const details = result.error.errors.map((e) => ({
        path: e.path.join('.') || VALIDATION_PATH_BODY,
        message: e.message,
      }));
      throw new ValidationError(`Invalid post: ${msg}`, details);
    }
    const id = req.params.id as string;
    if (result.data.id !== id) {
      throw new ValidationError(ErrorMessages.POST_ID_MISMATCH);
    }
    const post = await postsService.update(id, result.data);
    success(res, post);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await postsService.remove(id);
    success(res, null);
  } catch (err) {
    next(err);
  }
};
