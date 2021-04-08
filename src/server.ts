import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import { router } from './routes/index.route';
import { initDb } from './database';

dotenv.config({ path: 'config/.env' });

// Connect to DB
initDb();

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

// Express json parser
app.use(express.json());
// Express parser to read x-www-form-urlencoded req types
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', router);

const PORT = parseInt(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow.bold);
});
