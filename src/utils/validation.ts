import { z } from 'zod';

import { ValidationLimits } from '@/constants/validation';

/** Email format validation */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(ValidationLimits.EMAIL_MAX, 'Email is too long');

/** User create body */
export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(ValidationLimits.NAME_MAX, 'Name is too long'),
  email: emailSchema,
});

/** User update body (full user) */
export const userUpdateSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').max(ValidationLimits.NAME_MAX, 'Name is too long'),
  email: emailSchema,
});

/** Post create body */
export const postCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(ValidationLimits.TITLE_MAX, 'Title is too long'),
  body: z.string(),
  userId: z.string().min(1, 'UserId is required'),
});

/** Post update body – createdAt is server-managed, not accepted from client */
export const postUpdateSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(ValidationLimits.TITLE_MAX, 'Title is too long'),
  body: z.string(),
  userId: z.string().min(1, 'UserId is required'),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
