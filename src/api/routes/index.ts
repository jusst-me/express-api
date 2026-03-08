import { Router } from 'express';

import postsRoutes from '@/api/routes/posts.routes';
import usersRoutes from '@/api/routes/users.routes';

const router = Router();

router.use('/posts', postsRoutes);
router.use('/users', usersRoutes);

export default router;
