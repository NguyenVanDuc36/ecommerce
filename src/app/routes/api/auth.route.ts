import { authController } from '@src/app/controllers/auth.controller';
import { loginSchema } from '@src/app/validations';
import { validateMiddleware } from '@src/common/middlewares/validate.middleware';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post(
  '/login',
  validateMiddleware(loginSchema),
  authController.login,
);
