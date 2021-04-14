import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    profilePic?: string;
}

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        username: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true },
        profilePic: { type: String, default: '/images/defaultProfilePic.png' },
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model<IUser>('User', UserSchema);
