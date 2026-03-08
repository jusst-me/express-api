import type { NextFunction, Request, Response } from 'express';

import * as usersService from '../../services/users.service';
import type { User } from '../../types';
import { ValidationError } from '../../utils/errors';

const validateUserBody = (body: unknown): body is Omit<User, 'id'> => {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === 'string' &&
    b.name.length > 0 &&
    typeof b.email === 'string' &&
    b.email.length > 0
  );
};

const validateFullUser = (body: unknown): body is User => {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.name === 'string' &&
    b.name.length > 0 &&
    typeof b.email === 'string' &&
    b.email.length > 0
  );
};

export const list = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const users = usersService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = req.params.id as string;
    const user = usersService.findById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getPosts = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = req.params.id as string;
    const posts = usersService.findPostsByUserId(id);
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const create = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!validateUserBody(req.body)) {
      throw new ValidationError('Invalid user: name and email are required');
    }
    const user = usersService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const update = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!validateFullUser(req.body)) {
      throw new ValidationError('Invalid user: id, name, and email are required');
    }
    const id = req.params.id as string;
    if (req.body.id !== id) {
      throw new ValidationError('User id in body must match URL parameter');
    }
    const user = usersService.update(id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const remove = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = req.params.id as string;
    usersService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
