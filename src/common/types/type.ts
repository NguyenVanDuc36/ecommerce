import { UserDocument } from '@src/app/models/user';
import { NextFunction, Request, Response } from 'express';

export interface ExtendedRequest extends Request {
  tokens?: any;
  user?: UserDocument;
  files?: any;
  data?: any;
  authenticator: any;
}

export interface ExtendedNextFunction extends NextFunction {}

export interface ExtendedResponse extends Response {
  errorMessage?: string;
}
