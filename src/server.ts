import express from 'express';
import dotenv from 'dotenv';
import 'colors';

dotenv.config({ path: 'config/.env' });

const app = express();

const port = parseInt(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`.yellow.bold);
});
