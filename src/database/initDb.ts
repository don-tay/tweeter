import mongoose from 'mongoose';

export const initDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // enable query logging in dev
    if (process.env.NODE_ENV === 'development') {
        // conn.set('debug', true);
    }
    const { user, host, port, name: dbName } = conn.connection;
    console.log(`Connected to MongoDB host: ${host}:${port} db: ${dbName} user: ${user}`.cyan.underline.bold);
};
