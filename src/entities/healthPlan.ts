import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Appointment } from './appointment';
import { HealthPlanToEmployee } from './healthPlanToEmployee';
import { HealthPlanToPatient } from './healthPlanToPatient';
import { HealthPlanToSpecialty } from './healthPlanToSpecialty';
import { Invoice } from './invoice';
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
    (healthPlanToPatient) => healthPlanToPatient.healthPlan,
  )
  public healthPlanToPatients: HealthPlanToPatient[];

  @OneToMany(
    () => HealthPlanToEmployee,
    (healthPlanToEmployee) => healthPlanToEmployee.healthPlan,
  )
  public healthPlanToEmployees: HealthPlanToEmployee[];

  @OneToMany(() => Appointment, (appointment) => appointment.healthPlan)
  appointments: Appointment[];

  @OneToMany(() => Invoice, (invoice) => invoice.healthPlan)
  invoices: Invoice[];
}
