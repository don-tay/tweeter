import { IsNotEmpty, IsString } from 'class-validator';
import express from 'express';
import { asyncHandler, requireLogin } from '../../middlewares';
import { Post } from '../../schemas/post.schema';
import { User } from '../../schemas/user.schema';
export const postsRouter = express.Router();

class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}

// TODO: add query params to support limit offset
postsRouter.get(
    '/',
    requireLogin,
    asyncHandler(async (req, res, next) => {
        // Uses virtual defined in post schema
        const posts = await Post.find().populate('postedBy').sort({ createdAt: -1 }).exec();
        res.status(200).json({ data: posts });
    }),
);

postsRouter.post(
    '/',
    requireLogin,
    asyncHandler(async (req, res, next) => {
        const { content } = req.body;
        const payload = { content, postedBy: req.session.user };

        const data = await (await Post.create(payload)).populate('postedBy').execPopulate();

        res.status(201).json({ data });
    }),
);
