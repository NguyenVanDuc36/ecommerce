import { CouponController, ScoreBoardController } from '@src/app/controllers';
import { addScoreSchema } from '@src/app/validations';
import { getCouponsSchema } from '@src/app/validations/coupon';
import { authMiddleware } from '@src/common/middlewares/auth.middleware';
import { oneTimeRequestMiddleware } from '@src/common/middlewares/one-time-request.middleware';
import { validateMiddleware } from '@src/common/middlewares/validate.middleware';
import { Router } from 'express';

export const scoreBoardRouter = Router();

scoreBoardRouter.get(
  '/score-token',
  authMiddleware(),
  ScoreBoardController.generateScoreToken,
);

scoreBoardRouter.get(
  '/ranking',
  authMiddleware(),
  ScoreBoardController.getRanking,
);

scoreBoardRouter.post(
  '/add',
  authMiddleware(),
  oneTimeRequestMiddleware(),
  validateMiddleware(addScoreSchema),
  ScoreBoardController.addScore,
);
