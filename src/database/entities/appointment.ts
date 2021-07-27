import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from './employee';
import { HealthPlan } from './healthPlan';
import { Invoice } from './invoice';
import { Patient } from './patient';
import { appointmentStatusEnum } from './enums/appointmentStatusEnum';
import { v4 as uuid } from 'uuid';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: false })
  date: Date;

  @Column({ type: 'enum', enum: appointmentStatusEnum, nullable: false })
  status: appointmentStatusEnum;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 500, nullable: true })
  additionalInfo: string;

  @ManyToOne(() => Employee, (employee) => employee.appointments)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => HealthPlan, (healthPlan) => healthPlan.appointments)
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Invoice, (invoice) => invoice.appointments)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
