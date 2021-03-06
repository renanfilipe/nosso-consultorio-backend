import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Address } from './address';
import { Appointment } from './appointment';
import { HealthPlanToEmployee } from './healthPlanToEmployee';
import { Specialty } from './specialty';
import { v4 as uuid } from 'uuid';
import { GenderEnum } from './enums/genderEnum';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 11, nullable: false })
  phone: string;

  @Column({ nullable: true, unique: false })
  email: string;

  @Column({ length: 11, nullable: false, unique: true })
  document: string;

  @Column({ length: 50, nullable: false, unique: true })
  license: string;

  @Column({ nullable: false })
  birthdate: Date;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  photo: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => Specialty, (specialty) => specialty.employees)
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @OneToMany(
    () => HealthPlanToEmployee,
    (healthPlanToEmployee) => healthPlanToEmployee.employee,
  )
  public healthPlanToEmployees: HealthPlanToEmployee[];

  @OneToMany(() => Appointment, (appointment) => appointment.employee)
  appointments: Appointment[];
}
