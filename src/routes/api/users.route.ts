import { isEmpty } from 'class-validator';
import express from 'express';
import mongoose from 'mongoose';
import { asyncHandler, requireLogin } from '../../middlewares';
import { User } from '../../schemas/user.schema';

export const usersRouter = express.Router();

usersRouter.use(requireLogin);

usersRouter.put(
    '/:userId/follow',
    asyncHandler(async (req, res, next) => {
        const { userId } = req.params;
        const { _id: selfUserId } = req.session.user;
        const user = await User.findById(userId);
        if (isEmpty(user)) {
            return res.sendStatus(404);
        }

        const isFollowing = user.followers?.includes(req.session.user._id);
        const dbOperator = isFollowing ? '$pull' : '$addToSet';
        const session = await mongoose.startSession();
        session.startTransaction();
        const updatedSelf = await User.findByIdAndUpdate(selfUserId, { [dbOperator]: { following: userId } }, { new: true, session, lean: true });
        await user.updateOne({ [dbOperator]: { followers: selfUserId } }, { session }).exec();
        await session.commitTransaction();
        session.endSession();
        req.session.user = updatedSelf;

        const data = { user: updatedSelf };
        res.status(200).json({ data });
    }),
);

usersRouter.get(
    '/:userId/following',
    asyncHandler(async (req, res, next) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('following');
        res.status(200).json({ data: user });
    }),
);

usersRouter.get(
    '/:userId/followers',
    asyncHandler(async (req, res, next) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('followers');
        res.status(200).json({ data: user });
    }),
);
