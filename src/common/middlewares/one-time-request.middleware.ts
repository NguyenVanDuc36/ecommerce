import { authService } from '@src/app/services/auth.service';
import { NextFunction, Request, Response } from 'express';

export const oneTimeRequestMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    new Promise(async () => {
      const scoreToken = req.headers['x-one-time-token']?.toString();

      if (!scoreToken)
        return res.status(400).json({ message: 'Invalid score token!' });

      const isValid = await authService.isValidScoreToken(scoreToken);

      if (isValid) {
        next();
      } else {
        return res.status(400).json({ message: 'Invalid score token!' });
      }
    });
  };
