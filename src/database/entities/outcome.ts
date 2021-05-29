import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from './appointment';
import { v4 as uuid } from 'uuid';

@Entity()
export class Outcome {
  @PrimaryGeneratedColumn('uuid')
  outcomeId: string = uuid();

  @Column({ length: 1000, nullable: false })
  content: string;

  @Column({ nullable: false })
  createdAt: Date;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;
}
