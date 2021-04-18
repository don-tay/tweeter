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

postsRouter.post(
    '/',
    requireLogin,
    asyncHandler(async (req, res, next) => {
        const { content } = req.body;
        const payload = { content, postedBy: req.session.user };

        const newPost = await Post.create(payload);
        // populate response data with user information from user collection using newPost's postedBy value.
        const data = await User.populate(newPost, { path: 'postedBy' });

        res.status(201).json({ data });
    }),
);
