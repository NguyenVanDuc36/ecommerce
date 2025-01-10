import { userRepository } from '@src/app/repositories';
import { AuthService } from '@src/app/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { config } from '../config';
import { ETokenType } from '../enum';

export const authMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    new Promise(async () => {
      const authHeader = req.headers['authorization'];

      if (!authHeader)
        return res.status(403).json({ message: 'Unauthorized access!' });

      const [tokenType, accessToken] = authHeader.split(' ');

      if (!accessToken)
        return res.status(401).json({ message: 'Unauthorized access!' });

      if (tokenType === 'Bearer') {
        try {
          const payload = await AuthService.verityToken(
            accessToken,
            config.jwt.secret,
          );
          let user = await userRepository.findOne({ id: payload.sub });

          if (config.jwt.issuer !== payload['iss'])
            return res
              .status(httpStatus.UNAUTHORIZED)
              .json({ message: 'Invalid issuer!' });

          if (payload['type'] !== ETokenType.ACCESS_TOKEN)
            return res
              .status(httpStatus.UNAUTHORIZED)
              .json({ message: 'Please use access token to do so!' });

          req['user'] = user;
          next();
        } catch (error) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: 'Unauthorized access!' });
        }
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized access!' });
      }
    });
  };
