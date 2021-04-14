import session from 'express-session';
import { IUser } from '../schemas/user.schema';

// declaration of custom fields for session
declare module 'express-session' {
    export interface SessionData {
        // TODO: verify if session user is IUser
        user?: IUser;
    }
}
