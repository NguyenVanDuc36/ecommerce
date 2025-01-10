import { config } from '@src/common';
import { logger } from '@src/common/config/logger.config';
import Redis from 'ioredis';

class RedisService {
  private client: Redis | null = null;

  public async connect(): Promise<void> {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis successfully');
    });

    this.client.on('error', (error: Error) => {
      logger.error('Redis connection error:', error);
    });
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      logger.info('Disconnected from Redis');
      this.client = null;
    }
  }

  public async set<T>(
    key: string,
    value: T,
    ttlInSeconds?: number,
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }

    const stringValue = JSON.stringify(value);
    if (ttlInSeconds) {
      await this.client.set(key, stringValue, 'EX', ttlInSeconds);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }

    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  public async existsKey(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }

    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`Error checking existence of key "${key}":`, error);
    }
  }

  public async delete(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }

    await this.client.del(key);
  }
}

export default new RedisService();
