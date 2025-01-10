import { userRepository } from '@src/app/repositories';
import { config } from '@src/common';
import { logger } from '@src/common/config/logger.config';
import mongoose from 'mongoose';
import users from '../asset/users-example.data.json';
import { UserModel } from '../models/user';

export class DbService {
  static async connect() {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(config.mongodb.url, {
        maxPoolSize: 100,
      })
      .then(() => logger.info(`[${process.pid}] Connected to mongodb`))
      .catch(async (err) => {
        logger.error(err.stack);
        await this.disconnect();
      });
  }

  static async initializeUser() {
    try {
      const exist = await userRepository.exists({});
      if (exist) return;
      logger.info('[Migrate] Start initialize users');
      for (const user of users) {
        const newUser = new UserModel(user);
        await newUser.save();
      }
      logger.info('[Migrate] initialized users successfully');
    } catch (error) {
      logger.error('[Schedule] Error to initialize', error);
    }
  }

  static async disconnect() {
    return await mongoose.disconnect();
  }
}
