import * as Joi from '@hapi/joi';

export const createPatientSchema = Joi.object({
  anamnesis: Joi.string().max(500),
  birthdate: Joi.date().required(),
  city: Joi.string().max(255).required(),
  complement: Joi.string().max(255),
  document: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  emergencyPhone: Joi.string().min(10).max(11).required(),
  gender: Joi.string().valid('male', 'female').required(),
  name: Joi.string().max(255).required(),
  neighborhood: Joi.string().max(255).required(),
  number: Joi.string().max(255).required(),
  parent: Joi.string().uuid({ version: 'uuidv4' }),
  phone: Joi.string().min(10).max(11).required(),
  state: Joi.string().length(2).required(),
  street: Joi.string().max(255).required(),
  healthPlans: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
      number: Joi.string().max(50).required(),
    }),
  ),
});

export const updatePatientSchema = Joi.alternatives(
  Joi.string().uuid({ version: 'uuidv4' }).required(),
  Joi.object({
    anamnesis: Joi.string().max(500),
    birthdate: Joi.date().required(),
    city: Joi.string().max(255).required(),
    complement: Joi.string().max(255),
    document: Joi.string().length(11).required(),
    email: Joi.string().email().required(),
    emergencyPhone: Joi.string().min(10).max(11).required(),
    gender: Joi.string().valid('male', 'female').required(),
    name: Joi.string().max(255).required(),
    neighborhood: Joi.string().max(255).required(),
    number: Joi.string().max(255).required(),
    parentId: Joi.string().uuid({ version: 'uuidv4' }),
    phone: Joi.string().min(10).max(11).required(),
    state: Joi.string().length(2).required(),
    street: Joi.string().max(255).required(),
  }),
);
