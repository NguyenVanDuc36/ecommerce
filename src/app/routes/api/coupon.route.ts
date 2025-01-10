import { CouponController } from '@src/app/controllers';
import {
  getCouponsSchema,
  updateCouponSchema,
} from '@src/app/validations/coupon';
import { addCouponSchema } from '@src/app/validations/coupon/add-coupon.validation';
import { idParamsSchema } from '@src/app/validations/coupon/params.validation';
import { authMiddleware } from '@src/common/middlewares/auth.middleware';
import { validateMiddleware } from '@src/common/middlewares/validate.middleware';
import { Router } from 'express';

export const couponRouter = Router();
couponRouter.get(
  '',
  authMiddleware(),
  validateMiddleware(getCouponsSchema),
  CouponController.getCoupons,
);

couponRouter.get(
  '/:id',
  validateMiddleware(idParamsSchema),
  CouponController.getCoupon,
);
couponRouter.post(
  '',
  validateMiddleware(addCouponSchema),
  CouponController.createCoupon,
);

couponRouter.delete(
  '/:id',
  validateMiddleware(idParamsSchema),
  CouponController.deleteCoupon,
);

couponRouter.put(
  '/:id',
  validateMiddleware(idParamsSchema),
  validateMiddleware(updateCouponSchema),
  CouponController.updateCoupon,
);
