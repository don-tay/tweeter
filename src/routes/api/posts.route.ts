import { IsNotEmpty, IsString } from 'class-validator';
import express from 'express';
import mongoose from 'mongoose';
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

// all routes from here require authentication
postsRouter.use(requireLogin);

postsRouter.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { content } = req.body;
        const payload = { content, postedBy: req.session.user };
        const data = await (await Post.create(payload)).populate('postedBy').execPopulate();

        res.status(201).json({ data });
    }),
);

/**
 * @desc: Like/dislike post
 * @return: { data: { userLikes }}
 */
postsRouter.put(
    '/:postId/like',
    asyncHandler(async (req, res, next) => {
        const { postId } = req.params;
        const { _id: userId, postLikes } = req.session.user;
        const hasLikedPost = postLikes.includes(postId);
        // add to like array in db if has not like before. Otherwise, remove from array in db.
        const dbOperator = hasLikedPost ? '$pull' : '$addToSet';

        const session = await mongoose.startSession();
        session.startTransaction();
        // NB: use of brackets [] in options is mongoose syntax to pass mongodb operator dynamically
        const user = await User.findByIdAndUpdate(userId, { [dbOperator]: { postLikes: postId } }, { new: true, session }).exec();
        const post = await Post.findByIdAndUpdate(postId, { [dbOperator]: { userLikes: userId } }, { new: true, session }).exec();
        await session.commitTransaction();
        session.endSession();

        // Update state of user stored in session
        req.session.user = user;

        const data = { userLikes: post.userLikes };

        res.status(200).json({ data });
    }),
);
