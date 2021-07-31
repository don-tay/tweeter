import { isMongoId } from 'class-validator';
import express from 'express';
import { isEmpty } from 'lodash';
import { LeanDocument } from 'mongoose';
import { requireLogin } from '../middlewares';
import { IUser, User } from '../schemas/user.schema';
export const profilesRouter = express.Router();

// if replies tab selected, add payload selectedTab: 'replies'
profilesRouter.get('/:usernameOrId/replies', requireLogin, async (req, res) => {
    const { usernameOrId } = req.params;
    let user: LeanDocument<IUser>;
    if (isMongoId(usernameOrId)) {
        user = await User.findById(usernameOrId).lean().exec();
    } else {
        user = await User.findOne({ username: usernameOrId }).lean().exec();
    }

    const pageTitle = !isEmpty(user) ? user.username : 'User not found';

    const payload = {
        pageTitle,
        userLoggedIn: req.session?.user,
        profileUser: user,
        selectedTab: 'replies',
    };

    res.status(200).render('profilePage', payload);
});

profilesRouter.get('/:usernameOrId/following', requireLogin, async (req, res) => {
    const { usernameOrId } = req.params;
    let user: LeanDocument<IUser>;
    if (isMongoId(usernameOrId)) {
        user = await User.findById(usernameOrId).lean().exec();
    } else {
        user = await User.findOne({ username: usernameOrId }).lean().exec();
    }

    const pageTitle = !isEmpty(user) ? user.username : 'User not found';

    const payload = {
        pageTitle,
        userLoggedIn: req.session?.user,
        profileUser: user,
        selectedTab: 'following',
    };

    res.status(200).render('followerPage', payload);
});

profilesRouter.get('/:usernameOrId/followers', requireLogin, async (req, res) => {
    const { usernameOrId } = req.params;
    let user: LeanDocument<IUser>;
    if (isMongoId(usernameOrId)) {
        user = await User.findById(usernameOrId).lean().exec();
    } else {
        user = await User.findOne({ username: usernameOrId }).lean().exec();
    }

    const pageTitle = !isEmpty(user) ? user.username : 'User not found';

    const payload = {
        pageTitle,
        userLoggedIn: req.session?.user,
        profileUser: user,
        selectedTab: 'followers',
    };

    res.status(200).render('followerPage', payload);
});

profilesRouter.get('/:usernameOrId', requireLogin, async (req, res) => {
    const { usernameOrId } = req.params;
    let user: LeanDocument<IUser>;
    if (isMongoId(usernameOrId)) {
        user = await User.findById(usernameOrId).lean().exec();
    } else {
        user = await User.findOne({ username: usernameOrId }).lean().exec();
    }

    const pageTitle = !isEmpty(user) ? user.username : 'User not found';

    const payload = {
        pageTitle,
        userLoggedIn: req.session?.user,
        profileUser: user,
        selectedTab: 'posts',
    };

    res.status(200).render('profilePage', payload);
});
