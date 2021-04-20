import mongoose, { Schema } from 'mongoose';

export interface IPost extends mongoose.Document {
    content: string;
    postedBy: string;
    pinned: boolean;
}

const PostSchema = new mongoose.Schema(
    {
        content: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        pinned: Boolean,
        userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
