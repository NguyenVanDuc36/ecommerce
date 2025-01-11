import { logger } from '@src/common/config/logger.config';

import { mainRouter } from '@src/app/routes';
import { config } from '@src/common';
import {
  errorHandler,
  pageNotFoundError,
} from '@src/common/middlewares/error.middleware';
import { loggerMiddleware } from '@src/common/middlewares/logger.middleware';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import http from 'http';
import { socketService } from '../socket/socket';

export class ApiService {
  static app = express();
  static port = config.port || 3000;

  static start() {
    this.useMiddlewares([
      loggerMiddleware,
      bodyParser.json({ limit: '50mb' }),
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
      rateLimit({
        windowMs: 1000 * 60 * 60, // an hour
        max: 10000, // limit each IP to 100 requests per windowMs
        message:
          '⚠️Too many request created from this IP, please try again after an hour',
      }),
      express.json(),
      express.urlencoded({ extended: true }),
      compression(),
      helmet(),
      mongoSanitize({
        replaceWith: '_',
      }),
      cors({
        origin: '*',
      }),
      mainRouter,
      pageNotFoundError,
      errorHandler,
    ]);

    const httpServer = http.createServer(this.app);
    httpServer.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
      console.table({
        port: config.port,
        env: config.env,
      });
    });

    socketService.connect(httpServer);
  }

  static useMiddlewares(middlewares = []) {
    for (const middleware of middlewares) {
      this.app.use(middleware);
    }
  }
}
