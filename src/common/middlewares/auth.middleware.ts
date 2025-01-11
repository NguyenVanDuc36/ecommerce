import { authService } from '@src/app/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

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
          const user = await authService.verifyAccessToken(accessToken);
          if (!user) res.status(401).json({ message: 'Unauthorized access!' });
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
