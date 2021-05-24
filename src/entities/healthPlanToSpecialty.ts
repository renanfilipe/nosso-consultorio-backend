import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HealthPlan } from './healthPlan';
import { Specialty } from './specialty';
import { v4 as uuid } from 'uuid';

@Entity()
export class HealthPlanToSpecialty {
  @PrimaryGeneratedColumn('uuid')
  healthPlanToSpecialtyId: string = uuid();

  @ManyToOne(
    () => HealthPlan,
    (healthPlan) => healthPlan.healthPlanToSpecialties,
  )
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Specialty, (specialty) => specialty.healthPlanToSpecialties)
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @Column({ nullable: false })
  value: number;
}
