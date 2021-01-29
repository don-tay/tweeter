import express from 'express';
import dotenv from 'dotenv';
import 'colors';

dotenv.config({ path: 'config/.env' });

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const port = parseInt(process.env.PORT) || 5000;

app.get('/', (req, res) => {
  const payload = {
    pageTitle: 'Tweeter',
  };

  res.status(200).render('home', payload);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`.yellow.bold);
});
