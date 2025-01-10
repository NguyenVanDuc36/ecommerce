import { ApiError } from '@src/common/utils';

// import { queryFilter } from '@src/utils/filter';
import httpStatus from 'http-status';
import Joi from 'joi';
import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '../types/type';
import { queryFilter } from '../utils/filter';

export const validateMiddleware =
  (schema) =>
  (req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) => {
    const validSchema = queryFilter(schema, [
      'params',
      'query',
      'body',
      'file',
    ]);
    const object = queryFilter(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((detail) => {
          const message = detail.message;
          return message.replace(/['"]+/g, ''); // remove quotes
        })
        .join(', ');

      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }

    Object.assign(req, value);
    next();
  };
