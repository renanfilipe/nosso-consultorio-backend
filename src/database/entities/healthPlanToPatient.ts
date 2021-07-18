import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HealthPlan } from './healthPlan';
import { Patient } from './patient';
import { v4 as uuid } from 'uuid';

@Entity()
export class HealthPlanToPatient {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 50, nullable: false })
  number: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @ManyToOne(
    () => HealthPlan,
    (healthPlan) => healthPlan.healthPlanToPatients,
    { primary: true, eager: true },
  )
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Patient, (patient) => patient.healthPlanToPatients, {
    primary: true,
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;
}
