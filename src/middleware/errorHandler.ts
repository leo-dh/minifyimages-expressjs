import { ErrorRequestHandler } from 'express';
const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.send(err.message);
};

export default errorHandler;
