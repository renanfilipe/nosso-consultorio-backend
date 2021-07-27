import * as Joi from '@hapi/joi';

const customDateValidator = (value: string, helper: any) => {
  const date = new Date(value);
  const minutes = date.getMinutes();

  if (minutes % 30 !== 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return helper.message('Invalid date');
  }

  return true;
};

export const createAppointmentSchema = Joi.object({
  additionalInfo: Joi.string().max(500),
  date: Joi.date().greater('now').custom(customDateValidator).required(),
  employeeId: Joi.string().uuid({ version: 'uuidv4' }).required(),
  healthPlanId: Joi.string().uuid({ version: 'uuidv4' }),
  invoiceId: Joi.string().uuid({ version: 'uuidv4' }),
  patientId: Joi.string().uuid({ version: 'uuidv4' }).required(),
  status: Joi.string().valid('registered', 'cancelled', 'completed'),
});

export const updateAppointmentSchema = Joi.alternatives(
  Joi.string().uuid({ version: 'uuidv4' }).required(),
  Joi.object({
    additionalInfo: Joi.string().max(500),
    date: Joi.date().greater('now').custom(customDateValidator).required(),
    employeeId: Joi.string().uuid({ version: 'uuidv4' }).required(),
    healthPlanId: Joi.string().uuid({ version: 'uuidv4' }),
    invoiceId: Joi.string().uuid({ version: 'uuidv4' }),
    patientId: Joi.string().uuid({ version: 'uuidv4' }).required(),
    status: Joi.string().valid('registered', 'cancelled', 'completed'),
  }),
);
