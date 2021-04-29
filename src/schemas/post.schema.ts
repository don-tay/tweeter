import mongoose, { Schema } from 'mongoose';

export interface IPost extends mongoose.Document {
    content: string;
    postedBy: string;
    pinned: boolean;
    userLikes: string[];
    userRetweets: string[];
    retweetData: string;
    replyTo: string;
}

const PostSchema = new mongoose.Schema(
    {
        content: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        pinned: Boolean,
        userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        userRetweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    },
    { timestamps: true },
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
