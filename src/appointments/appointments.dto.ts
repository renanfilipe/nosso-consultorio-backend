import { appointmentStatusEnum } from 'src/database/entities/enums/appointmentStatusEnum';

export class CreateAppointmentDto {
  date: Date;
  additionalInfo?: string;
  patientId: string;
  employeeId: string;
  status: appointmentStatusEnum;
  healthPlanId?: string;
  invoiceId?: string;
}

export class UpdateAppointmentDto extends CreateAppointmentDto {}
