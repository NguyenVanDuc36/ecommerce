import Joi from 'joi';

export const idParamsSchema = {
  params: {
    id: Joi.number().required(),
  },
};
