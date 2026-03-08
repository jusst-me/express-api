import crypto from 'crypto';

import type { Post } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { readDb, writeDb } from './db.service';

export const findAll = async (dbPath?: string): Promise<Post[]> => {
  const db = await readDb(dbPath);
  return db.posts;
};

export const findById = async (id: string, dbPath?: string): Promise<Post> => {
  const db = await readDb(dbPath);
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  return post;
};

export const create = async (
  data: Omit<Post, 'id' | 'createdAt'>,
  dbPath?: string
): Promise<Post> => {
  const db = await readDb(dbPath);
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
  await writeDb(db, dbPath);
  return post;
};

export const update = async (
  id: string,
  data: Omit<Post, 'createdAt'>,
  dbPath?: string
): Promise<Post> => {
  const db = await readDb(dbPath);
  const index = db.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  const userExists = db.users.some((u) => u.id === data.userId);
  if (!userExists) {
    throw new ValidationError(`User with id ${data.userId} not found`);
  }
  const existing = db.posts[index];
  db.posts[index] = { ...data, id, createdAt: existing.createdAt };
  await writeDb(db, dbPath);
  return db.posts[index];
};

export const remove = async (id: string, dbPath?: string): Promise<void> => {
  const db = await readDb(dbPath);
  const index = db.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new NotFoundError(`Post with id ${id} not found`);
  }
  db.posts.splice(index, 1);
  await writeDb(db, dbPath);
};
