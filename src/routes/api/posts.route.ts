import express from 'express';
import { asyncHandler, requireLogin } from '../../middlewares';
export const postsRouter = express.Router();

postsRouter.post(
    '/',
    requireLogin,
    asyncHandler(async (req, res) => {
        const payload = {};

        res.status(200).json({});
    }),
);
