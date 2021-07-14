import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { SpecialtiesModule } from './specialties/specialties.module';
import { HealthPlansModule } from './healthPlans/healthPlans.module';
import { EmployeesModule } from './employees/employees.module';
import { PatientsModule } from './patients/patients.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    SpecialtiesModule,
    HealthPlansModule,
    EmployeesModule,
    PatientsModule,
    DatabaseModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
