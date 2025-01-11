import { couponController } from '@src/app/controllers';
import {
  getCouponsSchema,
  updateCouponSchema,
} from '@src/app/validations/coupon';
import { addCouponSchema } from '@src/app/validations/coupon/add-coupon.validation';
import { idParamsSchema } from '@src/app/validations/coupon/params.validation';
import { validateMiddleware } from '@src/common/middlewares/validate.middleware';
import { Router } from 'express';

export const couponRouter = Router();
couponRouter.get(
  '',
  validateMiddleware(getCouponsSchema),
  couponController.getCoupons,
);

couponRouter.get(
  '/:id',
  validateMiddleware(idParamsSchema),
  couponController.getCoupon,
);
couponRouter.post(
  '',
  validateMiddleware(addCouponSchema),
  couponController.createCoupon,
);

couponRouter.delete(
  '/:id',
  validateMiddleware(idParamsSchema),
  couponController.deleteCoupon,
);

couponRouter.put(
  '/:id',
  validateMiddleware(idParamsSchema),
  validateMiddleware(updateCouponSchema),
  couponController.updateCoupon,
);
