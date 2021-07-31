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

// all routes from here require authentication
postsRouter.use(requireLogin);

// TODO: add query params to support limit offset
postsRouter.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const searchQuery = req.query;
        const excludeReplies = searchQuery.excludeReplies ?? false;
        const followingOnly = searchQuery.followingOnly ?? false;
        if (excludeReplies === 'true') {
            searchQuery.replyTo = { $exists: false };
        }

        // logic to only get post from users following
        if (followingOnly === 'true') {
            const usersFollowing = [...req.session.user?.following] ?? [];
            usersFollowing.push(req.session.user?._id);
            searchQuery.postedBy = { $in: usersFollowing };
        }

        delete searchQuery.excludeReplies;
        delete searchQuery.followingOnly;

        // TODO: refactor reused queries
        const posts = await Post.find(searchQuery)
            .populate('postedBy')
            .sort({ createdAt: -1 })
            .populate({ path: 'retweetData', populate: { path: 'postedBy', model: 'User' } })
            .populate({ path: 'replyTo', populate: { path: 'postedBy', model: 'User' } })
            .lean()
            .exec();
        res.status(200).json({ data: posts });
    }),
);

// get user's replied posts only
postsRouter.get(
    '/:userId/replies',
    asyncHandler(async (req, res, next) => {
        const { userId } = req.params;
        // TODO: refactor reused queries
        const posts = await Post.find({ postedBy: userId, replyTo: { $exists: true } })
            .populate('postedBy')
            .sort({ createdAt: -1 })
            .populate({ path: 'retweetData', populate: { path: 'postedBy', model: 'User' } })
            .populate({ path: 'replyTo', populate: { path: 'postedBy', model: 'User' } })
            .lean()
            .exec();
        res.status(200).json({ data: posts });
    }),
);

postsRouter.get(
    '/:postId',
    asyncHandler(async (req, res, next) => {
        const { postId } = req.params;
        const [post, replies] = await Promise.all([
            Post.findById(postId)
                .populate('postedBy')
                .populate({ path: 'retweetData', populate: { path: 'postedBy', model: 'User' } })
                .populate({ path: 'replyTo', populate: { path: 'postedBy', model: 'User' } })
                .lean()
                .exec(),
            Post.find({ replyTo: postId }).populate('postedBy').lean().exec(),
        ]);
        const data = { ...post, replies };
        res.status(200).json({ data });
    }),
);

postsRouter.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { content, replyTo } = req.body;
        const payload = { content, postedBy: req.session.user, replyTo };
        const data = await (await Post.create(payload)).populate('postedBy').populate('replyTo').execPopulate();

        res.status(201).json({ data });
    }),
);

postsRouter.delete(
    '/:postId',
    asyncHandler(async (req, res, next) => {
        const { postId } = req.params;
        // ensures post to be deleted is by user, else fails
        const data = await Post.findOneAndDelete({ postedBy: req.session.user?._id, _id: postId }).lean().exec();
        if (data) {
            res.status(200).json({ data });
        } else {
            res.sendStatus(400);
        }
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
        const hasLikedPost: boolean = postLikes.includes(postId);
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
        const { _id: userId, postRetweets } = req.session.user;
        const hasRetweetedPost: boolean = postRetweets.includes(postId);
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
