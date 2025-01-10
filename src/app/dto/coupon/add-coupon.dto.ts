import {
  ECodeUsage,
  ECombinationTypeCoupon,
  EDiscountType,
} from '@src/common/enum';

export class AddCouponDto {
  name: string;
  codeUsage: ECodeUsage;
  prefix?: string;
  total: number;
  code?: string;
  discountType: EDiscountType;
  fixedDiscount?: number;
  maxDiscount?: number;
  percentageDiscount?: number;
  startDate: string;
  endDate: string;
  couponCombinationUUIDs?: string[];
  condition?: any;
  isDefault?: boolean;
  combinationType: ECombinationTypeCoupon;
}
