import { Router } from 'express';

import postsRoutes from './posts.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/posts', postsRoutes);
router.use('/users', usersRoutes);

export default router;
