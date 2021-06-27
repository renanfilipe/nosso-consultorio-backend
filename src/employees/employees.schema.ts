import * as Joi from '@hapi/joi';

export const createEmployeeSchema = Joi.object({
  name: Joi.string().max(255).required(),
  phone: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  document: Joi.string().length(11).required(),
  license: Joi.string().max(50).required(),
  photo: Joi.string().max(255).required(),
  description: Joi.string().max(1000).required(),
  tags: Joi.string().max(1000).required(),
});

export const updateEmployeeSchema = Joi.alternatives(
  Joi.string().uuid({ version: 'uuidv4' }).required(),
  Joi.object({
    name: Joi.string().max(255).required(),
    phone: Joi.string().length(11).required(),
    email: Joi.string().email().required(),
    document: Joi.string().length(11).required(),
    license: Joi.string().max(50).required(),
    photo: Joi.string().max(255).required(),
    description: Joi.string().max(1000).required(),
    tags: Joi.string().max(1000).required(),
  }),
);
