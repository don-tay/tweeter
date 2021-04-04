import express from 'express';
import { authRouter } from './auth.route';
export const router = express.Router();

router.use('/auth', authRouter);
