import {
  ECodeUsage,
  ECombinationTypeCoupon,
  EDiscountType,
} from '@src/common/enum';

export class GetCouponsDto {
  name?: string;
  codeUsage?: ECodeUsage;
  code?: string;
  discountType: EDiscountType;
  percentageDiscount?: number;
  combinationType?: ECombinationTypeCoupon;
  isValid?: boolean;
}
