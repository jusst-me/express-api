import type { NextFunction, Request, Response } from 'express';

import * as postsService from '../../services/posts.service';
import type { Post } from '../../types';
import { ValidationError } from '../../utils/errors';

const validatePostBody = (body: unknown): body is Omit<Post, 'id' | 'createdAt'> => {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.title === 'string' &&
    b.title.length > 0 &&
    typeof b.body === 'string' &&
    typeof b.userId === 'string' &&
    b.userId.length > 0
  );
};

const validateFullPost = (body: unknown): body is Post => {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.title === 'string' &&
    b.title.length > 0 &&
    typeof b.body === 'string' &&
    typeof b.userId === 'string' &&
    b.userId.length > 0 &&
    typeof b.createdAt === 'string'
  );
};

export const list = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const posts = postsService.findAll();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = req.params.id as string;
    const post = postsService.findById(id);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const create = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!validatePostBody(req.body)) {
      throw new ValidationError('Invalid post: title, body, and userId are required');
    }
    const post = postsService.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const update = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!validateFullPost(req.body)) {
      throw new ValidationError(
        'Invalid post: id, title, body, userId, and createdAt are required'
      );
    }
    const id = req.params.id as string;
    if (req.body.id !== id) {
      throw new ValidationError('Post id in body must match URL parameter');
    }
    const post = postsService.update(id, req.body);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const remove = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = req.params.id as string;
    postsService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
