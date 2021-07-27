import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from 'src/database/entities';
import { PatientsModule } from 'src/patients/patients.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { HealthPlansModule } from 'src/healthPlans/healthPlans.module';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
  imports: [
    PatientsModule,
    EmployeesModule,
    HealthPlansModule,
    TypeOrmModule.forFeature([Appointment]),
  ],
})
export class AppointmentsModule {}
