import { couponItemRepository, couponRepository } from '@src/app/repositories';
import { ApiError, generateUniqueCode } from '@src/common';
import { ECodeUsage } from '@src/common/enum';
import httpStatus from 'http-status';
import { ProjectionType, QueryOptions } from 'mongoose';
import {
  CouponDocument,
  CouponDocumentItem,
  CouponItemModel,
} from '../models/coupon';

class CouponHelper {
  /**
   * Retrieve a coupon by its ID, ensuring it exists.
   * Throws an error if the coupon is not found.
   *
   * @param id - The ID of the coupon to retrieve.
   * @param projection - Optional projection to limit the returned fields.
   * @param options - Additional query options (e.g., lean).
   * @returns The coupon object if found.
   */
  async mustGetCouponById(
    id: number,
    projection?: ProjectionType<CouponDocument>,
    options?: QueryOptions<CouponDocument> & { lean?: boolean },
  ): Promise<CouponDocument> {
    const coupon = await couponRepository.findOne({ id }, projection, options);
    if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found!');
    return coupon;
  }

  /**
   * Generate coupon items based on the provided payload.
   * Supports both single and multiple code usage types.
   *
   * @param payload - Object containing code usage type, total number of codes,
   *                  optional specific code, and optional prefix for codes.
   * @returns An array of generated coupon items.
   */
  async generateCouponItem<
    T extends {
      codeUsage: string;
      total: number;
      code?: string;
      prefix?: string;
    },
  >(payload: T) {
    if (payload.total === 0) return [];
    const couponItemCodes = (await couponItemRepository.find({})).map(
      (item) => item.code,
    );

    let couponItems: CouponDocumentItem[] = [];
    switch (payload.codeUsage) {
      case ECodeUsage.SINGLE:
        // Create a single coupon item with the specified code.
        const couponItem = await couponItemRepository.create({
          code: payload.code,
        });
        couponItems = [couponItem];
        break;

      case ECodeUsage.MULTIPLE:
        // Generate multiple coupon items with unique codes.
        couponItems = Array.from({ length: payload.total }).map(() => {
          const newCode = generateUniqueCode(
            payload.prefix.toUpperCase(),
            couponItemCodes,
          );
          couponItemCodes.push(newCode); // Add the new code to the existing codes list.
          return new CouponItemModel({
            code: newCode,
          });
        });

        // Insert the generated coupon items into the repository.
        couponItems = (await couponItemRepository.insertMany(
          couponItems,
        )) as unknown as CouponDocumentItem[];
        break;
    }

    return couponItems;
  }
}

export const couponHelper = new CouponHelper();
