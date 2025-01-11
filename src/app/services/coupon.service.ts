import { AddCouponDto, GetCouponsDto, PaginateDto } from '@src/app//dto';
import {
  CouponDocument,
  CouponDocumentItem,
  CouponModel,
} from '@src/app//models/coupon';
import { couponHelper } from '@src/app/helpers';
import { couponRepository } from '@src/app/repositories';
import { ApiError } from '@src/common';
import { ECodeUsage, EDiscountType } from '@src/common/enum';
import httpStatus from 'http-status';
import moment from 'moment';
import { FilterQuery } from 'mongoose';

class CouponService {
  async createCoupon(payload: AddCouponDto): Promise<CouponDocument> {
    if (payload?.code && payload.codeUsage === ECodeUsage.SINGLE) {
      const exist = await couponRepository.exists({
        code: payload.code,
      });

      if (exist)
        throw new ApiError(httpStatus.CONFLICT, 'Coupon code already exist');
    }

    const couponItems = await couponHelper.generateCouponItem(payload);

    const newCoupon = new CouponModel({
      name: payload.name,
      codeUsage: payload.codeUsage,
      code: payload?.code,
      total: payload.total,
      codePrefix: payload?.prefix,
      couponItems: couponItems.map((item) => item._id),
      codeAvailable: payload.total,
      discountType: payload.discountType,
      combinationType: payload.combinationType,
      startDate: moment(payload.startDate).startOf('day').toDate(),
      endDate: moment(payload.endDate).endOf('day').toDate(),
      ...(payload.discountType === EDiscountType.FIXED && {
        fixedDiscount: payload.fixedDiscount,
      }),
      ...(payload.discountType === EDiscountType.PERCENTAGE && {
        maxDiscount: payload.maxDiscount,
        percentageDiscount: payload.percentageDiscount,
      }),
    });

    await newCoupon.save();
    const populatedCoupon = await newCoupon.populate('couponItems');

    return populatedCoupon;
  }

  async getCoupon(id: number): Promise<CouponDocument> {
    return couponHelper.mustGetCouponById(
      id,
      {},
      { populate: { path: 'couponItems' } },
    );
  }
  async getCoupons(
    filter: FilterQuery<CouponDocument> & PaginateDto & GetCouponsDto,
  ) {
    return couponRepository.paginate(
      {
        ...(filter?.name && { name: new RegExp(filter.name.toString(), 'i') }),
        ...(filter?.code && { code: filter.code }),
        ...(filter?.codeUsage && { codeUsage: filter.codeUsage }),
        ...(filter?.status && { status: filter.status }),
        ...(filter?.combinationType && {
          combinationType: filter.combinationType,
        }),
        ...(filter?.isValid
          ? {
              $and: [
                {
                  startDate: { $lte: moment() },
                  endDate: { $gte: moment() },
                },
              ],
            }
          : {}),
      },
      {
        limit: filter.limit,
        page: filter.page,
        populate: ['couponItems'],
        sort: filter.sort,
      },
    );
  }

  async updateCoupon(id: number, payload: any): Promise<CouponDocument> {
    let newCouponItems: CouponDocumentItem[] = [];
    const coupon = await couponHelper.mustGetCouponById(id);

    if (payload.total < coupon.total)
      throw new ApiError(
        httpStatus.NOT_ACCEPTABLE,
        'Cannot reduce below the number already used',
      );

    if (
      payload.total > coupon.total &&
      coupon.codeUsage === ECodeUsage.MULTIPLE
    ) {
      newCouponItems = await couponHelper.generateCouponItem({
        prefix: coupon.codePrefix,
        codeUsage: ECodeUsage.MULTIPLE,
        total: payload.total - coupon.total,
      });
    }
    const oldCouponItemIds = coupon.couponItems.map((item) =>
      item._id.toString(),
    );

    const updatedCoupon = await CouponModel.findOneAndUpdate(
      { id: coupon.id },
      {
        ...(payload?.combinationType && {
          combinationType: payload.combinationType,
        }),
        ...(payload?.name && { name: payload.name }),
        ...(payload?.total && { total: payload.total }),
        ...(payload?.discountType === EDiscountType.FIXED && {
          fixedDiscount: payload.fixedDiscount,
        }),
        ...(payload?.discountType === EDiscountType.PERCENTAGE && {
          maxDiscount: payload.maxDiscount,
          percentageDiscount: payload.percentageDiscount,
        }),
        ...(payload.startDate && {
          startDate: moment(payload.startDate).startOf('day').toDate(),
        }),
        ...(payload.endDate && {
          endDate: moment(payload.endDate).endOf('day').toDate(),
        }),
        ...(newCouponItems.length && {
          couponItems: oldCouponItemIds.concat(
            newCouponItems.map((item) => item._id.toString()),
          ),
        }),
      },
      {
        new: true,
        populate: { path: 'couponItems' },
      },
    );

    return updatedCoupon;
  }

  async deleteCoupon(id: number): Promise<CouponDocument> {
    const coupon = await couponHelper.mustGetCouponById(id);
    await coupon.deleteOne();
    return coupon;
  }
}

export const couponService = new CouponService();
