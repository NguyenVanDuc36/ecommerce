import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config'; // Import logger nếu có, hoặc dùng console.log
import moment from 'moment';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url, headers, body, query } = req;
  const startTime = Date.now();
  logger.info(
    `[${moment(startTime).format('DD/MM/YYYY hh:mm:ss')}] Request - Method: ${method}, URL: ${url}`,
  );

  next();
};
