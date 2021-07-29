import express from 'express';
import { errorHandler } from '../../middlewares';
import { postsRouter } from './posts.route';
import { usersRouter } from './users.route';
export const apiRouter = express.Router();

apiRouter.use(errorHandler);

apiRouter.use('/posts', postsRouter);
apiRouter.use('/users', usersRouter);
