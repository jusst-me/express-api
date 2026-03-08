import crypto from 'crypto';

import type { Post, User } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { readDb, writeDb } from './db.service';

export const findAll = (dbPath?: string): User[] => {
  const db = readDb(dbPath);
  return db.users;
};

export const findById = (id: string, dbPath?: string): User => {
  const db = readDb(dbPath);
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return user;
};

export const findPostsByUserId = (userId: string, dbPath?: string): Post[] => {
  const db = readDb(dbPath);
  const userExists = db.users.some((u) => u.id === userId);
  if (!userExists) {
    throw new NotFoundError(`User with id ${userId} not found`);
  }
  return db.posts.filter((p) => p.userId === userId);
};

export const create = (data: Omit<User, 'id'>, dbPath?: string): User => {
  const db = readDb(dbPath);
  const id = crypto.randomUUID();
  const user: User = { ...data, id };
  db.users.push(user);
  writeDb(db, dbPath);
  return user;
};

export const update = (id: string, data: User, dbPath?: string): User => {
  const db = readDb(dbPath);
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  db.users[index] = { ...data, id };
  writeDb(db, dbPath);
  return db.users[index];
};

export const remove = (id: string, dbPath?: string): void => {
  const db = readDb(dbPath);
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  const hasPosts = db.posts.some((p) => p.userId === id);
  if (hasPosts) {
    throw new ValidationError('Cannot delete user with existing posts');
  }
  db.users.splice(index, 1);
  writeDb(db, dbPath);
};
