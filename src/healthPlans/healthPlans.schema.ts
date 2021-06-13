import * as Joi from '@hapi/joi';

export const createHealthPlanSchema = Joi.object({
  name: Joi.string().max(255).required(),
  specialties: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid({ version: 'uuidv4' }).required(),
        value: Joi.number().min(0).required(),
      }),
    )
    .required(),
});
