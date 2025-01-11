/** Auth */
export enum ETokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

/** Coupon */
export enum ECodeUsage {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum ECustomerCondition {
  NEW_CUSTOMER = 'new_customer',
  FIRST_RENEW = 'first_renew',
  YEAR_PACKAGE = 'year_package',
}

export enum ECouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ECouponItemStatus {
  UNUSED = 'unused',
  USED = 'used',
}

export enum EDiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum ECombinationTypeCoupon {
  ALL = 'all',
  AND = 'and',
  OR = 'or',
}

export enum EScoreType {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

/** Socket */

export enum SizeLimitEnum {
  CONNECTION_LIMIT = 3,
}

export enum EClientToServerEvent {
  JOIN_RANKING = 'join-ranking',
  LEAVE_RANKING = 'leave-ranking',
}

export enum EServerToClientEvent {
  UPDATE_RANKING = 'update-ranking',
}
