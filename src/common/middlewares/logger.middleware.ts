import { logger } from '@src/common/config/logger.config';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url } = req;
  const startTime = Date.now();
  logger.info(
    `[${moment(startTime).format('DD/MM/YYYY hh:mm:ss')}] Request - Method: ${method}, URL: ${url}`,
  );

  next();
};
