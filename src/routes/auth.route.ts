import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import express from 'express';
import bcrypt from 'bcrypt';
import { PASSWORD_REGEX, USERNAME_REGEX } from '../constants';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { validateModel } from '../utilities';
import { User } from '../schemas/user.schema';
export const authRouter = express.Router();

class RegisterUserDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is compulsory.' })
    firstName: string;
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @IsString()
    @Length(5, 15)
    @Matches(USERNAME_REGEX, {
        message: 'Username must consist of alphanumeric characters, underscores or hyphens, and be between 5-15 characters long.',
    })
    username: string;
    @IsEmail()
    email: string;
    @Length(8, 25)
    @Matches(PASSWORD_REGEX, {
        message:
            'Password must fulfil the following: at least 1 alphanumeric character, 1 special character in "!@#$%^&*" and be 8 to 25 characters long.',
    })
    password: string;
}

class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}

authRouter.get('/login', (req, res, next) => {
    res.status(200).render('login');
});

authRouter.post(
    '/login',
    asyncHandler(async (req, res, next) => {
        const { username, password } = req.body;
        const payload = { username: username?.trim(), password };
        try {
            await validateModel(LoginUserDto, payload);
        } catch (e) {
            const errorPayload = { ...payload, errorMessage: e.message };
            return res.status(400).render('login', errorPayload);
        }
        res.status(200).render('home');
    }),
);

authRouter.get('/register', (req, res, next) => {
    res.status(200).render('register');
});

authRouter.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const { firstName, lastName, username, email, password } = req.body;
        const payload = {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            username: username?.trim(),
            email: email?.trim(),
            password,
        };

        // TODO: port validation logic from class-validator to mongoose
        try {
            await validateModel(RegisterUserDto, payload);
        } catch (e) {
            const errorMessage = e.message;
            const errorPayload = { ...payload, errorMessage };
            return res.status(400).render('register', errorPayload);
        }

        // check if username or email already exist, and handle
        const user = await User.findOne({ $or: [{ username }, { email }] }, { projection: [username, email] })
            .lean()
            .exec();

        let errorMessage = '';
        if (user?.username === payload.username) {
            errorMessage += `Username '${username}' has already been used. Have you registered before?\n`;
        }
        if (user?.email === payload.email) {
            errorMessage += `Email '${email}' has already been used. Have you registered before?\n`;
        }
        if (isNotEmpty(errorMessage)) {
            const errorPayload = { ...payload, errorMessage };
            return res.status(400).render('register', errorPayload);
        }

        // hash password
        payload.password = await bcrypt.hash(password, 10);
        const newUser = await User.create(payload);
        req.session.user = newUser;

        res.status(200).redirect('/');
    }),
);
