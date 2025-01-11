import { LoginDto } from '@src/app/dto';
import { UserDocument, UserModel } from '@src/app/models/user';
import { userRepository } from '@src/app/repositories';
import redisService from '@src/app/services/redis.service';
import { ApiError, config } from '@src/common';
import { ETokenType } from '@src/common/enum';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';

export class AuthService {
  async login(payload: LoginDto): Promise<Record<string, any>> {
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

    const tokens = await this.generateAuthTokens(user);

    delete user['_doc'].password;
    delete user['_doc'].bossAppearsAt;
    delete user['_doc'].bossStatus;
    return { ...user.toObject(), tokens };
  }

  async generateAuthTokens(user: UserDocument) {
    const accessToken = this._generateToken(
      {
        sub: user.id,
        iss: config.jwt.issuer,
        type: ETokenType.ACCESS_TOKEN,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpirationMinutes },
    );

    const refreshToken = this._generateToken(
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
  async isValidScoreToken(token: string): Promise<boolean> {
    try {
      const payload = this.verityToken(token, config.score.secret);

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

  _generateToken(
    payload: Record<string, any>,
    key: string,
    options: SignOptions = {},
  ) {
    return jwt.sign(payload, key, options).toString();
  }

  async verifyAccessToken(accessToken: string): Promise<UserDocument> {
    try {
      const payload = await authService.verityToken(
        accessToken,
        config.jwt.secret,
      );

      if (config.jwt.issuer !== payload['iss']) return null;
      if (payload['type'] !== ETokenType.ACCESS_TOKEN) return null;

      return userRepository.findOne({ id: payload.sub });
    } catch (error) {
      return null;
    }
  }

  verityToken(token: string, secret = config.jwt.secret) {
    return jwt.verify(token, secret);
  }
}

export const authService = new AuthService();
