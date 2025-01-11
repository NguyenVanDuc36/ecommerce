import {
  ECodeUsage,
  ECombinationTypeCoupon,
  ECouponStatus,
  EDiscountType,
} from '@src/common/enum';
import { uniqueStringGenerator } from '@src/common/utils/slugify';
import mongoose, { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { toJSON } from '../plugins';

export interface CouponDocument extends Document {
  name: string;
  id: number;
  codePrefix?: string;
  code?: string;
  fixedDiscount?: number;
  percentageDiscount?: number;
  maxDiscount?: number;
  total: number;
  codeUsage: ECodeUsage;
  discountType: EDiscountType;
  couponCombinations: mongoose.Types.ObjectId[];
  couponItems: mongoose.Types.ObjectId[];
  status: ECouponStatus;
  combinationType: ECombinationTypeCoupon;
  startDate: Date;
  endDate: Date;
}

const CouponSchema = new mongoose.Schema<CouponDocument>(
  {
    name: { type: String, required: true, maxlength: 250 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    id: { type: Number },
    codePrefix: { type: String, maxlength: 250 },
    code: { type: String, maxlength: 20 },
    fixedDiscount: { type: Number, min: 1, max: 1000000000 },
    percentageDiscount: { type: Number, min: 1, max: 100 },
    maxDiscount: { type: Number, min: 1, max: 1000000000 },
    total: { type: Number, required: true },
    codeUsage: {
      type: String,
      enum: Object.values(ECodeUsage),
      default: ECodeUsage.SINGLE,
    },
    discountType: {
      type: String,
      enum: Object.values(EDiscountType),
      default: EDiscountType.FIXED,
    },
    couponItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CouponItem' }],
    status: {
      type: String,
      enum: Object.values(ECouponStatus),
      default: ECouponStatus.ACTIVE,
    },
    combinationType: {
      type: String,
      enum: Object.values(ECombinationTypeCoupon),
      default: ECombinationTypeCoupon.ALL,
    },
  },
  { timestamps: true },
);

CouponSchema.plugin(toJSON);
CouponSchema.plugin(paginate);

CouponSchema.pre('save', async function (next) {
  if (!this.id) this.id = await uniqueStringGenerator('iId', 'CouponModel');
  next();
});

export const CouponModel = mongoose.model<
  CouponDocument,
  mongoose.PaginateModel<CouponDocument>
>('coupons', CouponSchema, 'coupons');
