import express from 'express';
export const authRouter = express.Router();

authRouter.get('/login', (req, res, next) => {
    res.status(200).render('login');
});

authRouter.post('/login', (req, res, next) => {
    res.status(200).render('login');
});

authRouter.get('/register', (req, res, next) => {
    res.status(200).render('register');
});

authRouter.post('/register', (req, res, next) => {
    res.status(200).render('register');
});
