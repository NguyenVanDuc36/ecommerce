import { CouponItemModel, CouponDocumentItem } from '@src/app/models/coupon';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract-repository';

export class CouponItemRepository extends AbstractRepository<CouponDocumentItem> {
  constructor(protected readonly couponModel: Model<CouponDocumentItem>) {
    super(couponModel);
  }
}

export const couponItemRepository = new CouponItemRepository(CouponItemModel);
