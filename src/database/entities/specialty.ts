import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Employee } from './employee';
import { HealthPlanToSpecialty } from './healthPlanToSpecialty';
import { v4 as uuid } from 'uuid';

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 255, nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @OneToMany(
    () => HealthPlanToSpecialty,
    (healthPlanToSpecialty) => healthPlanToSpecialty.specialty,
  )
  public healthPlanToSpecialties: HealthPlanToSpecialty[];

  @OneToMany(() => Employee, (employee) => employee.specialty)
  employees: Employee[];
}
