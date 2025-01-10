import {
  ECodeUsage,
  ECombinationTypeCoupon,
  EDiscountType,
} from '@src/common/enum';
import Joi from 'joi';

export const addCouponSchema = {
  body: {
    name: Joi.string().trim().min(1).max(250).required(),
    codeUsage: Joi.string()
      .valid(...Object.values(ECodeUsage))
      .required(),
    prefix: Joi.when('codeUsage', {
      is: ECodeUsage.MULTIPLE,
      then: Joi.string()
        .trim()
        .regex(/^\S*$/, 'no spaces')
        .regex(/^[a-zA-Z0-9_]*$/, 'no special characters')
        .length(3)
        .required(),
      otherwise: Joi.optional(),
    }),
    total: Joi.number().required(),
    code: Joi.when('codeUsage', {
      is: ECodeUsage.SINGLE,
      then: Joi.string()
        .trim()
        .regex(/^\S*$/, 'no spaces')
        .regex(/^[a-zA-Z0-9_]*$/, 'no special characters')
        .min(6)
        .max(20)
        .required(),
      otherwise: Joi.optional(),
    }),
    discountType: Joi.string()
      .valid(...Object.values(EDiscountType))
      .required(),
    fixedDiscount: Joi.when('discountType', {
      is: EDiscountType.FIXED,
      then: Joi.number().min(1).max(1000000000).required(),
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
      .required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  },
};
