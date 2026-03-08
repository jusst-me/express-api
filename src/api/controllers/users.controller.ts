import type { NextFunction, Request, Response } from 'express';

import * as usersService from '../../services/users.service';
import { ValidationError } from '../../utils/errors';
import { userCreateSchema, userUpdateSchema } from '../../utils/validation';

export const list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await usersService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await usersService.findById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const posts = await usersService.findPostsByUserId(id);
    res.json(posts);
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
        path: e.path.join('.') || 'body',
        message: e.message,
      }));
      throw new ValidationError(`Invalid user: ${msg}`, details);
    }
    const user = await usersService.create(result.data);
    res.status(201).json(user);
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
        path: e.path.join('.') || 'body',
        message: e.message,
      }));
      throw new ValidationError(`Invalid user: ${msg}`, details);
    }
    const id = req.params.id as string;
    if (result.data.id !== id) {
      throw new ValidationError('User id in body must match URL parameter');
    }
    const user = await usersService.update(id, result.data);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await usersService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
