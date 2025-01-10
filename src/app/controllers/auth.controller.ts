import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const coupon = await AuthService.login(req.body);
      res.json({ data: coupon });
    } catch (error) {
      next(error);
    }
  }
}
