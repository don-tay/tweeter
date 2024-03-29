import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    profilePic?: string;
    postLikes: string[];
    postRetweets: string[];
    following: string[];
    followers: string[];
}

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        username: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true },
        profilePic: { type: String, default: '/assets/images/defaultProfilePic.jpeg' },
        postLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        postRetweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model<IUser>('User', UserSchema);
