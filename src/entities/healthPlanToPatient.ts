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
  healthPlanToPatientId: string = uuid();

  @Column({ nullable: false })
  number: string;

  @ManyToOne(() => HealthPlan, (healthPlan) => healthPlan.healthPlanToPatients)
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Patient, (patient) => patient.healthPlanToPatients)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;
}
