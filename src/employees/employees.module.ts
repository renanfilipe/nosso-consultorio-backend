import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/database/entities';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee])],
})
export class EmployeesModule {}
