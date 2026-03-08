import crypto from 'crypto';

import type { Post } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { readDb, writeDb } from './db.service';

export const findAll = (dbPath?: string): Post[] => {
  const db = readDb(dbPath);
  return db.posts;
};

export const findById = (id: string, dbPath?: string): Post => {
  const db = readDb(dbPath);
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  return post;
};

export const create = (data: Omit<Post, 'id' | 'createdAt'>, dbPath?: string): Post => {
  const db = readDb(dbPath);
  const userExists = db.users.some((u) => u.id === data.userId);
  if (!userExists) {
    throw new ValidationError(`User with id ${data.userId} not found`);
  }
  const id = crypto.randomUUID();
  const post: Post = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  db.posts.push(post);
  writeDb(db, dbPath);
  return post;
};

export const update = (id: string, data: Post, dbPath?: string): Post => {
  const db = readDb(dbPath);
  const index = db.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  const userExists = db.users.some((u) => u.id === data.userId);
  if (!userExists) {
    throw new ValidationError(`User with id ${data.userId} not found`);
  }
  db.posts[index] = { ...data, id };
  writeDb(db, dbPath);
  return db.posts[index];
};

export const remove = (id: string, dbPath?: string): void => {
  const db = readDb(dbPath);
  const index = db.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  db.posts.splice(index, 1);
  writeDb(db, dbPath);
};
