import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HealthPlanToSpecialty } from './healthPlanToSpecialty';
import { v4 as uuid } from 'uuid';

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  specialtyId: string = uuid();

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  value: number;

  @OneToMany(
    () => HealthPlanToSpecialty,
    (healthPlanToSpecialty) => healthPlanToSpecialty.specialty,
  )
  public healthPlanToSpecialties: HealthPlanToSpecialty[];
}
