import { Appointment } from 'src/database/entities';

export type CreateAppointmentResponse = Pick<Appointment, 'id'>;
export type UpdateAppointmentResponse = CreateAppointmentResponse;
