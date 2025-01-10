import { ECombinationTypeCoupon, EDiscountType } from '@src/common/enum';
import Joi from 'joi';
import { paginateSchema } from '../paginate.validation';

export const getCouponsSchema = {
  query: {
    name: Joi.string().trim().min(1).max(250).optional(),
    code: Joi.string()
      .trim()
      .regex(/^\S*$/, 'no spaces')
      .regex(/^[a-zA-Z0-9_]*$/, 'no special characters')
      .min(6)
      .max(20)
      .optional(),
    discountType: Joi.string()
      .valid(...Object.values(EDiscountType))
      .optional(),
    percentageDiscount: Joi.number().min(1).max(100).optional(),
    combinationType: Joi.string()
      .valid(...Object.values(ECombinationTypeCoupon))
      .optional(),
      isValid: Joi.bool().optional(),
    ...paginateSchema,
  },
};
