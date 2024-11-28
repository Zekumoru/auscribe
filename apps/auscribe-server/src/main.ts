import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import apiRouter from './routes/api';

const app = express();

app.use(cors());

app.use('/api', apiRouter);
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Server is running.',
  });
});

const ENV_PORT = process.env.AUSCRIBE_API_PORT;
const port = isNaN(Number(ENV_PORT)) ? 3000 : Number(ENV_PORT);
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
