/* eslint-disable n/no-sync */
import fs from 'fs';
import os from 'os';
import path from 'path';

import type { DbSchema } from '../types';
import * as usersService from './users.service';

const createTempDb = (): string => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'users-service-test-'));
  const dbPath = path.join(tmpDir, 'db.json');
  const data: DbSchema = {
    users: [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ],
    posts: [{ id: '1', title: 'P', body: 'B', userId: '1', createdAt: '' }],
  };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return dbPath;
};

describe('users.service', () => {
  let dbPath: string;

  beforeEach(() => {
    dbPath = createTempDb();
  });

  afterEach(() => {
    fs.rmSync(path.dirname(dbPath), { recursive: true });
  });

  describe('findAll', () => {
    it('returns all users', () => {
      const users = usersService.findAll(dbPath);
      expect(users).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('returns user by id', () => {
      const user = usersService.findById('1', dbPath);
      expect(user.name).toBe('User 1');
    });

    it('throws NotFoundError for non-existent id', () => {
      expect(() => usersService.findById('999', dbPath)).toThrow('User with id 999 not found');
    });
  });

  describe('findPostsByUserId', () => {
    it('returns posts for user', () => {
      const posts = usersService.findPostsByUserId('1', dbPath);
      expect(posts).toHaveLength(1);
      expect(posts[0].userId).toBe('1');
    });

    it('throws NotFoundError for non-existent user', () => {
      expect(() => usersService.findPostsByUserId('999', dbPath)).toThrow(
        'User with id 999 not found'
      );
    });
  });

  describe('create', () => {
    it('creates a new user', () => {
      const user = usersService.create({ name: 'New User', email: 'new@example.com' }, dbPath);
      expect(user.name).toBe('New User');
      expect(user).toHaveProperty('id');
      const all = usersService.findAll(dbPath);
      expect(all).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('updates a user', () => {
      const updated = usersService.update(
        '1',
        { id: '1', name: 'Updated', email: 'updated@example.com' },
        dbPath
      );
      expect(updated.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('removes a user without posts', () => {
      usersService.remove('2', dbPath);
      expect(() => usersService.findById('2', dbPath)).toThrow();
    });

    it('throws ValidationError when user has posts', () => {
      expect(() => usersService.remove('1', dbPath)).toThrow(
        'Cannot delete user with existing posts'
      );
    });
  });
});
