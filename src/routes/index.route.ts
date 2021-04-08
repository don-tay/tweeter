import express from 'express';
import { requireLogin } from '../middlewares';
import { authRouter } from './auth.route';
export const router = express.Router();

router.use('/auth', authRouter);

router.use('/', requireLogin, (req, res) => {
    const payload = {
        pageTitle: 'Tweeter',
    };

    res.status(200).render('home', payload);
});
