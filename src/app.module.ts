import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';

import { AppointmentsModule } from './appointments/appointments.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { HealthPlansModule } from './healthPlans/healthPlans.module';
import { PatientsModule } from './patients/patients.module';
import { SpecialtiesModule } from './specialties/specialties.module';

@Module({
  imports: [
    AppointmentsModule,
    DatabaseModule,
    EmployeesModule,
    HealthPlansModule,
    PatientsModule,
    SpecialtiesModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
