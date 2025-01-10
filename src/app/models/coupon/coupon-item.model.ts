import { ECouponItemStatus } from '@src/common/enum';
import mongoose, { Document, Schema } from 'mongoose';

export interface CouponDocumentItem extends Document {
  coupon: mongoose.Types.ObjectId;
  code: string;
  status: ECouponItemStatus;
}

const CouponItemSchema = new Schema<CouponDocumentItem>(
  {
    // coupon: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Coupon',
    //   required: true,
    // },
    code: { type: String, required: true, maxlength: 20, minlength: 3 },
    status: {
      type: String,
      enum: Object.values(ECouponItemStatus),
      default: ECouponItemStatus.UNUSED,
    },
  },
  { timestamps: true },
);

export const CouponItemModel = mongoose.model<CouponDocumentItem>(
  'CouponItem',
  CouponItemSchema,
);
