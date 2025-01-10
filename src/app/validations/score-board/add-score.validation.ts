import Joi from 'joi';

export const addScoreSchema = {
  body: Joi.object({
    type: Joi.number().valid(1, 2, 3).required(),
  }),
};
