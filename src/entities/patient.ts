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
import { HealthPlanToPatient } from './healthPlanToPatient';
import { v4 as uuid } from 'uuid';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  patientId: string = uuid();

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

  @Column({ length: 11, nullable: false })
  emergencyPhone: string;

  @Column({ length: 1000, nullable: false })
  anamnesis: string;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => Patient, (patient) => patient.patientId)
  @JoinColumn({ name: 'parentPatientId' })
  parentPatientId?: Patient;

  @OneToMany(
    () => HealthPlanToPatient,
    (healthPlanToPatient) => healthPlanToPatient.patient,
  )
  healthPlanToPatients: HealthPlanToPatient[];
}
