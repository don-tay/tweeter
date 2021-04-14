import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import morgan from 'morgan';
import session from 'express-session';
import { router } from './routes/index.route';
import { initDb } from './database';

dotenv.config({ path: 'config/.env' });

// Connect to DB
initDb();

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
    }),
);
// Express json parser
app.use(express.json());
// Express parser to read x-www-form-urlencoded req types
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', router);

const PORT = parseInt(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, _promise: Promise<any>) => {
    console.log(`Unhandled Error: ${err?.message}`.bgRed);
    // Write diagnostic report
    process.report.writeReport(err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
