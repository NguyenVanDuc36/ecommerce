import { ExtendedResponse } from '../types/type';

export class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (res: ExtendedResponse, error: ErrorHandler) => {
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal Server Error',
  });
};
