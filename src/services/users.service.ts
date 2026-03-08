import crypto from 'crypto';

import type { Post, User } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { readDb, writeDb } from './db.service';

export const findAll = async (dbPath?: string): Promise<User[]> => {
  const db = await readDb(dbPath);
  return db.users;
};

export const findById = async (id: string, dbPath?: string): Promise<User> => {
  const db = await readDb(dbPath);
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return user;
};

export const findPostsByUserId = async (userId: string, dbPath?: string): Promise<Post[]> => {
  const db = await readDb(dbPath);
  const userExists = db.users.some((u) => u.id === userId);
  if (!userExists) {
    throw new NotFoundError(`User with id ${userId} not found`);
  }
  return db.posts.filter((p) => p.userId === userId);
};

export const create = async (data: Omit<User, 'id'>, dbPath?: string): Promise<User> => {
  const db = await readDb(dbPath);
  const id = crypto.randomUUID();
  const user: User = { ...data, id };
  db.users.push(user);
  await writeDb(db, dbPath);
  return user;
};

export const update = async (id: string, data: User, dbPath?: string): Promise<User> => {
  const db = await readDb(dbPath);
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  db.users[index] = { ...data, id };
  await writeDb(db, dbPath);
  return db.users[index];
};

export const remove = async (id: string, dbPath?: string): Promise<void> => {
  const db = await readDb(dbPath);
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  const hasPosts = db.posts.some((p) => p.userId === id);
  if (hasPosts) {
    throw new ValidationError('Cannot delete user with existing posts');
  }
  db.users.splice(index, 1);
  await writeDb(db, dbPath);
};
