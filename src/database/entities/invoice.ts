import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from './appointment';
import { HealthPlan } from './healthPlan';
import { invoiceStatusEnum } from './enums/invoiceStatusEnum';
import { v4 as uuid } from 'uuid';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  createdAt: Date;

  @Column()
  paidAt: Date;

  @Column({ type: 'enum', enum: invoiceStatusEnum })
  status: invoiceStatusEnum;

  @ManyToOne(() => HealthPlan, (healthPlan) => healthPlan.invoices)
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @OneToMany(() => Appointment, (appointment) => appointment.invoice)
  appointments: Appointment[];
}
