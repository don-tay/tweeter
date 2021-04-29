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

    replyTo?: string;
}

// TODO: add query params to support limit offset
postsRouter.get(
    '/',
    requireLogin,
    asyncHandler(async (req, res, next) => {
        // TODO: refactor reused queries
        const posts = await Post.find().populate('postedBy').sort({ createdAt: -1 }).populate('retweetData').populate('replyTo').exec();
        let data = await User.populate(posts, { path: 'replyTo.postedBy' });
        data = await User.populate(data, { path: 'retweetData.postedBy' });
        res.status(200).json({ data });
    }),
);

postsRouter.get(
    '/:postId',
    requireLogin,
    asyncHandler(async (req, res, next) => {
        const { postId } = req.params;
        const posts = await Post.findById(postId).populate('postedBy').populate('retweetData').populate('replyTo').exec();
        let data = await User.populate(posts, { path: 'replyTo.postedBy' });
        data = await await User.populate(data, { path: 'retweetData.postedBy' });
        res.status(200).json({ data });
    }),
);

// all routes from here require authentication
postsRouter.use(requireLogin);

postsRouter.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { content, replyTo } = req.body;
        const payload = { content, postedBy: req.session.user, replyTo };
        const data = await (await Post.create(payload)).populate('postedBy').populate('replyTo').execPopulate();

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
        const user = await User.findByIdAndUpdate(userId, { [dbOperator]: { postLikes: postId } }, { new: true, session, lean: true }).exec();
        const post = await Post.findByIdAndUpdate(postId, { [dbOperator]: { userLikes: userId } }, { new: true, session, lean: true }).exec();
        await session.commitTransaction();
        session.endSession();

        // Update state of user stored in session
        req.session.user = user;

        const data = { userLikes: post.userLikes };

        res.status(200).json({ data });
    }),
);

/**
 * @desc: Retweet/delete retweet
 * @return: { data: { originalPost: Post, retweetPost: Post }}
 */
postsRouter.post(
    '/retweet',
    asyncHandler(async (req, res, next) => {
        const { postId } = req.body;
        console.log(postId);
        const { _id: userId, postRetweets } = req.session.user;
        const hasRetweetedPost = postRetweets.includes(postId);
        // TODO: add handler to prevent user from retweeting own post
        // add to retweet array in db if has not retweet before. Otherwise, remove from array in db.
        const dbOperator = hasRetweetedPost ? '$pull' : '$addToSet';

        const session = await mongoose.startSession();
        const postDataToCreate = { postedBy: userId, retweetData: postId };
        session.startTransaction();
        // add/delete userId who retweeted the original post
        const originalPost = await Post.findByIdAndUpdate(
            postId,
            { [dbOperator]: { userRetweets: userId } },
            { new: true, session, lean: true },
        ).exec();
        // NB: use of brackets [] in options is mongoose syntax to pass mongodb operator dynamically
        const user = await User.findByIdAndUpdate(userId, { [dbOperator]: { postRetweets: postId } }, { new: true, session, lean: true }).exec();
        // upsert acts as 2nd measure (though not necessary, to ensure every user can retweet at most once)
        const retweetPost = hasRetweetedPost
            ? await Post.findOneAndDelete(postDataToCreate, { session }).lean().exec()
            : (await Post.create([postDataToCreate], { session }))[0];
        await session.commitTransaction();
        session.endSession();

        // Update state of user stored in session
        req.session.user = user;

        const data = { originalPost, retweetPost };

        res.status(200).json({ data });
    }),
);
