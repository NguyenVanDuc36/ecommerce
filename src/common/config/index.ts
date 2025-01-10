import dotenv from 'dotenv';
import path from 'path';
import process from 'process';
import { mustCheckEnv } from '../utils/must-check-env';

dotenv.config({ path: path.join(__dirname, '../../../.env') });
mustCheckEnv(
  'NODE_ENV',
  'PORT',
  'PREFIX',
  'MONGO_URL',
  'JWT_ACCESS_EXPIRATION',
  'JWT_REFRESH_EXPIRATIONS',
  'JWT_SECRET',
  'JWT_ISSUER',
);

export const config = {
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  prefix: process.env.PREFIX,
  mongodb: {
    url: process.env.MONGO_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATIONS,
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  score: {
    expiration: process.env.SCORE_EXPIRATION,
    secret: process.env.SCORE_SECRET,
  },
};
