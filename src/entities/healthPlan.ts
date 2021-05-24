import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HealthPlanToPatient } from './healthPlanToPatient';
import { HealthPlanToSpecialty } from './healthPlanToSpecialty';
import { v4 as uuid } from 'uuid';

@Entity()
export class HealthPlan {
  @PrimaryGeneratedColumn('uuid')
  healthPlanId: string = uuid();

  @Column({ length: 255, nullable: false })
  name: string;

  @OneToMany(
    () => HealthPlanToSpecialty,
    (healthPlanToSpecialty) => healthPlanToSpecialty.healthPlan,
  )
  public healthPlanToSpecialties: HealthPlanToSpecialty[];

  @OneToMany(
    () => HealthPlanToPatient,
    (healthPlanToPatient) => healthPlanToPatient.patient,
  )
  public healthPlanToPatients: HealthPlanToPatient[];
}
