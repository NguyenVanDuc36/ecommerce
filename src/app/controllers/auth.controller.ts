import { authService } from '@src/app/services/auth.service';
import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import httpStatus from 'http-status';

export class AuthController {
  async login(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await authService.login(req.body);
      res.status(httpStatus.OK).json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
