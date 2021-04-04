import express from 'express';
export const authRouter = express.Router();

authRouter.get('/login', (req, res, next) => {
    res.status(200).render('login');
});
