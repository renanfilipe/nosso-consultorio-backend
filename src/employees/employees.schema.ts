import * as Joi from '@hapi/joi';

export const createEmployeeSchema = Joi.object({
  birthdate: Joi.date().required(),
  city: Joi.string().max(255).required(),
  complement: Joi.string().max(255),
  description: Joi.string().max(1000),
  document: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid('male', 'female').required(),
  license: Joi.string().max(50).required(),
  name: Joi.string().max(255).required(),
  neighborhood: Joi.string().max(255).required(),
  number: Joi.string().max(255).required(),
  phone: Joi.string().length(11).required(),
  photo: Joi.string().max(1000),
  specialty: Joi.string().uuid({ version: 'uuidv4' }).required(),
  state: Joi.string().length(2).required(),
  street: Joi.string().max(255).required(),
});

export const updateEmployeeSchema = Joi.alternatives(
  Joi.string().uuid({ version: 'uuidv4' }).required(),
  Joi.object({
    birthdate: Joi.date().required(),
    city: Joi.string().max(255).required(),
    complement: Joi.string().max(255).allow(null, ''),
    description: Joi.string().max(1000).allow(null, ''),
    document: Joi.string().length(11).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid('male', 'female').required(),
    license: Joi.string().max(50).required(),
    name: Joi.string().max(255).required(),
    neighborhood: Joi.string().max(255).required(),
    number: Joi.string().max(255).required(),
    phone: Joi.string().length(11).required(),
    photo: Joi.string().max(1000).allow(null, ''),
    specialty: Joi.string().uuid({ version: 'uuidv4' }).required(),
    state: Joi.string().length(2).required(),
    street: Joi.string().max(255).required(),
  }),
);

export const patchEmployeeSchema = Joi.alternatives(
  Joi.string().uuid({ version: 'uuidv4' }).required(),
  Joi.object({
    isActive: Joi.bool().required(),
  }),
);
