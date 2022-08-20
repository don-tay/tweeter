import mongoose from 'mongoose';

export const initDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // enable query logging in dev
    if (process.env.NODE_ENV === 'development') {
        // conn.set('debug', true);
    }
    const { host, port, name: dbName } = conn.connection;
    console.log(`Connected to MongoDB host: ${host}:${port} db: ${dbName}`.cyan.underline.bold);
};
