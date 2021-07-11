import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Employee,
  Address,
  HealthPlanToEmployee,
  HealthPlan,
} from 'src/database/entities';
import { SpecialtiesModule } from 'src/specialties/specialties.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
  imports: [
    SpecialtiesModule,
    TypeOrmModule.forFeature([
      Employee,
      Address,
      HealthPlanToEmployee,
      HealthPlan,
    ]),
  ],
})
export class EmployeesModule {}
