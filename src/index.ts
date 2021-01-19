import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

import express, { urlencoded, json } from 'express';
import helmet from 'helmet';
import router from './router';
import { requestLogger, errorHandler, errorLogger, apiLimiter } from './middleware';
import { logger } from './utils';

const port = process.env.PORT || 5000;
const app = express();
app.set('trust proxy', 1); // From
app.use(requestLogger);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use('/api', router, apiLimiter);
// Let nginx do the file serving if on production
if (process.env.NODE_ENV === 'dev') {
  app.use('/tmp', express.static('tmp', { maxAge: 3600000 }));
}
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Listening on port ${port}.`);
});
