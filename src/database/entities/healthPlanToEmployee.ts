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

  @Column({ nullable: false })
  value: number;

  @ManyToOne(() => HealthPlan, (healthPlan) => healthPlan.healthPlanToEmployees)
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @ManyToOne(() => Employee, (employee) => employee.healthPlanToEmployees)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
