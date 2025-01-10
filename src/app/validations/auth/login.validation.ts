import Joi from 'joi';

export const loginSchema = {
  body: {
    userName: Joi.string().trim().min(10).max(20).required(),
    password: Joi.string().trim().min(6).max(20).required(),
  },
};
