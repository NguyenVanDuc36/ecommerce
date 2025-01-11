import { ECombinationTypeCoupon, EDiscountType } from '@src/common/enum';
import Joi from 'joi';

export const updateCouponSchema = {
  body: {
    name: Joi.string().trim().min(1).max(250).optional(),
    total: Joi.number().optional(),
    discountType: Joi.string()
      .valid(...Object.values(EDiscountType))
      .optional(),
    fixedDiscount: Joi.when('discountType', {
      is: EDiscountType.FIXED,
      then: Joi.number().min(1).max(1000000000).optional(),
      otherwise: Joi.optional(),
    }),
    maxDiscount: Joi.when('discountType', {
      is: EDiscountType.PERCENTAGE,
      then: Joi.number().min(1).max(1000000000).optional(),
      otherwise: Joi.optional(),
    }),
    percentageDiscount: Joi.when('discountType', {
      is: EDiscountType.PERCENTAGE,
      then: Joi.number().min(1).max(100).optional(),
      otherwise: Joi.optional(),
    }),
    combinationType: Joi.string()
      .valid(...Object.values(ECombinationTypeCoupon))
      .optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
  },
};
