import mongoose from 'mongoose';

export const initDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const { user, host, port, name: dbName } = conn.connection;
    console.log(`Connected to MongoDB host: ${host}:${port} db: ${dbName} user: ${user}`.cyan.underline.bold);
};
