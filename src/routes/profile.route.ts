import express from 'express';
import { isEmpty } from 'lodash';
import { requireLogin } from '../middlewares';
import { User } from '../schemas/user.schema';
export const profilesRouter = express.Router();

profilesRouter.get('/:username', requireLogin, async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).lean().exec();

    const pageTitle = !isEmpty(user) ? user.username : 'User not found';

    const payload = {
        pageTitle,
        userLoggedIn: req.session?.user,
        profileUser: user,
    };

    res.status(200).render('profilePage', payload);
});
