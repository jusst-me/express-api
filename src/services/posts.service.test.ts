/* eslint-disable n/no-sync */
import fs from 'fs';
import os from 'os';
import path from 'path';

import type { DbSchema } from '../types';
import * as postsService from './posts.service';

const createTempDb = (): string => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-service-test-'));
  const dbPath = path.join(tmpDir, 'db.json');
  const data: DbSchema = {
    users: [{ id: '1', name: 'Test', email: 'test@example.com' }],
    posts: [
      {
        id: '1',
        title: 'Post 1',
        body: 'Body 1',
        userId: '1',
        createdAt: '2025-01-01T00:00:00Z',
      },
    ],
  };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return dbPath;
};

describe('posts.service', () => {
  let dbPath: string;

  beforeEach(() => {
    dbPath = createTempDb();
  });

  afterEach(() => {
    fs.rmSync(path.dirname(dbPath), { recursive: true });
  });

  describe('findAll', () => {
    it('returns all posts', () => {
      const posts = postsService.findAll(dbPath);
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Post 1');
    });
  });

  describe('findById', () => {
    it('returns post by id', () => {
      const post = postsService.findById('1', dbPath);
      expect(post.id).toBe('1');
      expect(post.title).toBe('Post 1');
    });

    it('throws NotFoundError for non-existent id', () => {
      expect(() => postsService.findById('999', dbPath)).toThrow('Post with id 999 not found');
    });
  });

  describe('create', () => {
    it('creates a new post', () => {
      const post = postsService.create({ title: 'New', body: 'Body', userId: '1' }, dbPath);
      expect(post.title).toBe('New');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('createdAt');
      const all = postsService.findAll(dbPath);
      expect(all).toHaveLength(2);
    });

    it('throws ValidationError for non-existent userId', () => {
      expect(() =>
        postsService.create({ title: 'New', body: 'Body', userId: '999' }, dbPath)
      ).toThrow('User with id 999 not found');
    });
  });

  describe('update', () => {
    it('updates a post', () => {
      const updated = postsService.update(
        '1',
        {
          id: '1',
          title: 'Updated',
          body: 'New body',
          userId: '1',
          createdAt: '2025-01-01T00:00:00Z',
        },
        dbPath
      );
      expect(updated.title).toBe('Updated');
    });

    it('throws NotFoundError for non-existent id', () => {
      expect(() =>
        postsService.update(
          '999',
          {
            id: '999',
            title: 'T',
            body: 'B',
            userId: '1',
            createdAt: new Date().toISOString(),
          },
          dbPath
        )
      ).toThrow('Post with id 999 not found');
    });
  });

  describe('remove', () => {
    it('removes a post', () => {
      postsService.remove('1', dbPath);
      expect(() => postsService.findById('1', dbPath)).toThrow();
    });

    it('throws NotFoundError for non-existent id', () => {
      expect(() => postsService.remove('999', dbPath)).toThrow('Post with id 999 not found');
    });
  });
});
