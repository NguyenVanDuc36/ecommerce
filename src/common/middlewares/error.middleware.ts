import httpStatus from 'http-status';
import { logger } from '../config/logger.config';
import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '../types/type';
import { ApiError } from '../utils';

export const pageNotFoundError = (
  req: ExtendedRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  res: ExtendedResponse,
  next: ExtendedNextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  return res.status(404).json({ error: 'Page not found' });
};

export const errorHandler = (
  err: any,
  req: ExtendedRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  res: ExtendedResponse,
  next: ExtendedNextFunction,
) => {
  let error = err;
  if (error && !(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;
  res.errorMessage = error.message;
  const response = {
    statusCode,
    message,
  };

  logger.error(err);

  res.status(statusCode).send(response);
  next();
};
