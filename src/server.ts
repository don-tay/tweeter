import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import { requireLogin } from './middlewares';
import { router } from './routes/index.route';

dotenv.config({ path: 'config/.env' });

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

// Express json parser
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', router);

app.get('/', requireLogin, (req, res) => {
    const payload = {
        pageTitle: 'Tweeter',
    };

    res.status(200).render('home', payload);
});

const PORT = parseInt(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`.yellow.bold);
});
