import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import express from 'express';
import { PASSWORD_REGEX } from '../constants';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { validateModel } from '../utilities';
export const authRouter = express.Router();

class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @IsString()
    @Length(5, 20)
    username: string;
    @IsEmail()
    email: string;
    @Length(8, 25)
    @Matches(PASSWORD_REGEX)
    password: string;
}

class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    loginUsername: string;
    @IsString()
    @IsNotEmpty()
    loginPassword: string;
}

authRouter.get('/login', (req, res, next) => {
    res.status(200).render('login');
});

authRouter.post('/login', (req, res, next) => {
    const { loginUsername, loginPassword } = req.body;
    const payload = { loginUsername: loginUsername.trim(), loginPassword };
    res.status(200).render('login', payload);
});

authRouter.get('/register', (req, res, next) => {
    res.status(200).render('register');
});

authRouter.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const { firstName, lastName, username, email, password } = req.body;
        const payload = { firstName: firstName.trim(), lastName: lastName.trim(), username: username.trim(), email: email.trim(), password };
        await validateModel(RegisterUserDto, payload);
        res.status(200).render('register', payload);
    }),
);
