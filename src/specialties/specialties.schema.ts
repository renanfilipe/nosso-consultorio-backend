import * as Joi from '@hapi/joi';

export const createSpecialtySchema = Joi.object({
  name: Joi.string().max(255).required(),
  value: Joi.number().min(0).required(),
});
