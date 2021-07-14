import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Address } from './address';
import { Appointment } from './appointment';
import { HealthPlanToPatient } from './healthPlanToPatient';
import { GenderEnum } from './enums/genderEnum';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 11, nullable: false })
  phone: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ length: 11, nullable: false, unique: true })
  document: string;

  @Column({ nullable: false })
  birthdate: Date;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ length: 11, nullable: false })
  emergencyPhone: string;

  @Column({ length: 1000, nullable: false })
  anamnesis: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => Patient, (patient) => patient.id)
  @JoinColumn({ name: 'parentPatientId' })
  parentPatientId?: Patient;

  @OneToMany(
    () => HealthPlanToPatient,
    (healthPlanToPatient) => healthPlanToPatient.patient,
  )
  healthPlanToPatients: HealthPlanToPatient[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
