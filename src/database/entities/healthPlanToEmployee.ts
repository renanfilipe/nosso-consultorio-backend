import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from './employee';
import { HealthPlan } from './healthPlan';
import { v4 as uuid } from 'uuid';

@Entity()
export class HealthPlanToEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @ManyToOne(
    () => HealthPlan,
    (healthPlan) => healthPlan.healthPlanToEmployees,
    { primary: true, eager: true },
  )
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Employee, (employee) => employee.healthPlanToEmployees, {
    primary: true,
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
