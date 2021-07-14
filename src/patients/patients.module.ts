import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address, HealthPlanToPatient, Patient } from 'src/database/entities';
import { HealthPlansModule } from 'src/healthPlans/healthPlans.module';

import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
  imports: [
    HealthPlansModule,
    TypeOrmModule.forFeature([Address, Patient, HealthPlanToPatient]),
  ],
})
export class PatientsModule {}
