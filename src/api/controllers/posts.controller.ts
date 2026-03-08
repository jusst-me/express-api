import type { NextFunction, Request, Response } from 'express';

import * as postsService from '../../services/posts.service';
import { ValidationError } from '../../utils/errors';
import { postCreateSchema, postUpdateSchema } from '../../utils/validation';

export const list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await postsService.findAll();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const post = await postsService.findById(id);
    res.json(post);
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
        path: e.path.join('.') || 'body',
        message: e.message,
      }));
      throw new ValidationError(`Invalid post: ${msg}`, details);
    }
    const post = await postsService.create(result.data);
    res.status(201).json(post);
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
        path: e.path.join('.') || 'body',
        message: e.message,
      }));
      throw new ValidationError(`Invalid post: ${msg}`, details);
    }
    const id = req.params.id as string;
    if (result.data.id !== id) {
      throw new ValidationError('Post id in body must match URL parameter');
    }
    const post = await postsService.update(id, result.data);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await postsService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
