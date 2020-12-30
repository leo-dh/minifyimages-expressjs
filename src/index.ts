import dotenv from 'dotenv';
import express, { urlencoded, json } from 'express';
import router from './router';
import requestLogger from './middleware/requestLogger';
import errorLogger from './middleware/errorLogger';
import logger from './utils/logger';

dotenv.config({
  path: '.env',
});

const port = process.env.PORT || 5000;
const app = express();
app.use(requestLogger);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/', router);
app.use(errorLogger);

app.listen(port, () => {
  logger.info(`Listening on port ${port}.`);
});
