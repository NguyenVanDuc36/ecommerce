import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import httpStatus from 'http-status';
import { AddCouponDto } from '../dto/coupon/add-coupon.dto';
import { couponService } from '../services';

export class CouponController {
  static async updateCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.updateCoupon(+req.params.id, req.body);
      res.json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }

  static async getCoupons(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.getCoupons(req.query as any);
      res.json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }

  static async getCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.getCoupon(+req.params.id);
      res.json({ coupon });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await couponService.deleteCoupon(+req.params.id);
      res.json({ coupon, message: 'Deleted coupon successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createCoupon(
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
