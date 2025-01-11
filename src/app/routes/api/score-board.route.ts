import { scoreBoardController } from '@src/app/controllers';
import { addScoreSchema } from '@src/app/validations';
import { authMiddleware } from '@src/common/middlewares/auth.middleware';
import { oneTimeRequestMiddleware } from '@src/common/middlewares/one-time-request.middleware';
import { validateMiddleware } from '@src/common/middlewares/validate.middleware';
import { Router } from 'express';

export const scoreBoardRouter = Router();

//
scoreBoardRouter.get(
  '/score-token',
  authMiddleware(),
  scoreBoardController.generateScoreToken,
);

scoreBoardRouter.get(
  '/ranking',
  authMiddleware(),
  scoreBoardController.getRanking,
);

scoreBoardRouter.post(
  '/add',
  authMiddleware(),
  oneTimeRequestMiddleware(),
  validateMiddleware(addScoreSchema),
  scoreBoardController.addScore,
);
