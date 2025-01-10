import Joi from 'joi';

export const paginateSchema = {
  limit: Joi.number().integer().min(1).default(10).optional().messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
  }),
  page: Joi.number().integer().min(1).default(1).optional().messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1',
  }),
  sort: Joi.string()
    .default('asc')
    .optional()
    .messages({ 'any.only': 'Sort must be either asc or desc' }),
};
