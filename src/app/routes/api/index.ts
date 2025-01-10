import express from 'express';
import { authRouter } from './auth.route';
import { couponRouter } from './coupon.route';
import { scoreBoardRouter } from './score-board.route';

export const apiRouter = express.Router();
apiRouter.use('/coupons', couponRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/score-board', scoreBoardRouter);
