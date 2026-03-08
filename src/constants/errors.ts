/** Error messages used across the API – single source of truth */
export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Not Found',
  USER_ID_MISMATCH: 'User id in body must match URL parameter',
  POST_ID_MISMATCH: 'Post id in body must match URL parameter',
  CANNOT_DELETE_USER_WITH_POSTS: 'Cannot delete user with existing posts',
} as const;
