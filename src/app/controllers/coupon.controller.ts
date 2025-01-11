import { AddCouponDto } from '@src/app/dto/coupon/add-coupon.dto';
import { couponService } from '@src/app/services';
import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import httpStatus from 'http-status';

export class CouponController {
  async updateCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.updateCoupon(+req.params.id, req.body);
      res.status(httpStatus.OK).json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }

  async getCoupons(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.getCoupons(req.query as any);
      res.status(httpStatus.OK).json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }

  async getCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.getCoupon(+req.params.id);
      res.status(httpStatus.OK).json({ coupon });
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.deleteCoupon(+req.params.id);
      res
        .status(httpStatus.OK)
        .json({ coupon, message: 'Deleted coupon successfully' });
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const newCoupon = await couponService.createCoupon(
        req.body as AddCouponDto,
      );
      res
        .status(httpStatus.CREATED)
        .json({ message: 'Created coupon successfully', data: newCoupon });
    } catch (error) {
      next(error);
    }
  }
}

export const couponController = new CouponController();
