import express from 'express';
import { requireLogin } from '../middlewares';
import { authRouter } from './auth.route';
import { apiRouter } from './api/api.route';
export const router = express.Router();

router.use('/api', apiRouter);
router.use('/auth', authRouter);

router.use('/', requireLogin, (req, res) => {
    const payload = {
        pageTitle: 'Tweeter',
        userLoggedIn: req.session?.user,
    };

    res.status(200).render('home', payload);
});
