import { ApiError, config } from '@src/common';
import { ETokenType } from '@src/common/enum';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import { LoginDto } from '../dto';
import { UserModel } from '../models';
import { UserDocument } from '../models/user';
import { userRepository } from '../repositories';
import redisService from './redis.service';

export class AuthService {
  static generateToken(
    payload: Object,
    key: string,
    options: SignOptions = {},
  ) {
    return jwt.sign(payload, key, options).toString();
  }

  static verityToken(token: string, secret = config.jwt.secret) {
    return jwt.verify(token, secret);
  }

  static async login(payload: LoginDto) {
    const user = await UserModel.findOne({
      userName: payload.userName,
    }).select('+password');

    if (
      !user ||
      !user?.password ||
      !bcrypt.compareSync(payload.password, user.password)
    )
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'user name or password is incorrect',
      );

    const tokens = await AuthService.generateAuthTokens(user);

    delete user['_doc'].password;
    delete user['_doc'].bossAppearsAt;
    delete user['_doc'].bossStatus;
    return { ...user.toObject(), tokens };
  }

  static async generateAuthTokens(user: UserDocument) {
    const accessToken = AuthService.generateToken(
      {
        sub: user.id,
        iss: config.jwt.issuer,
        type: ETokenType.ACCESS_TOKEN,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpirationMinutes },
    );

    const refreshToken = AuthService.generateToken(
      {
        sub: user.id,
        iss: config.jwt.issuer,
        type: ETokenType.REFRESH_TOKEN,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpirationDays },
    );

    return { accessToken, refreshToken };
  }

  /**
   * Validates if a score token is valid and not reused.
   *
   * @param {string} token - The token to validate.
   * @returns {Promise<boolean>} - Returns true if the token is valid, otherwise false.
   */
  static async isValidScoreToken(token: string): Promise<boolean> {
    try {
      const payload = AuthService.verityToken(token, config.score.secret);

      const user = await userRepository.findOne({ id: payload?.sub });
      if (!user) return false;

      // Check if the token already exists in Redis cache
      const exist = await redisService.existsKey(token);
      if (exist) return false;

      // Store the token in Redis with a 30-second expiration time
      await redisService.set(token, {}, 30);

      return true;
    } catch (error) {
      // If any error occurs (invalid token, database issue, etc.), return false
      return false;
    }
  }
}
