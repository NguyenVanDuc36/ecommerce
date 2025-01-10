import { CouponModel } from '@src/app/models';
import { CouponDocument } from '@src/app/models/coupon';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract-repository';

export class CouponRepository extends AbstractRepository<CouponDocument> {
  constructor(protected readonly couponModel: Model<CouponDocument>) {
    super(couponModel);
  }
}

export const couponRepository = new CouponRepository(CouponModel);
