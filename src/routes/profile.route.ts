import { isMongoId } from 'class-validator';
import express from 'express';
import { isEmpty } from 'lodash';
import { LeanDocument } from 'mongoose';
import { requireLogin } from '../middlewares';
import { IUser, User } from '../schemas/user.schema';
export const profilesRouter = express.Router();

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
    };

    res.status(200).render('profilePage', payload);
});
