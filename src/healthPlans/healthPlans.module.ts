import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthPlan, Specialty } from 'src/database/entities';
import { SpecialtiesModule } from 'src/specialties/specialties.module';
import { HealthPlansController } from './healthPlans.controller';
import { HealthPlansService } from './healthPlans.service';

@Module({
  controllers: [HealthPlansController],
  providers: [HealthPlansService],
  exports: [HealthPlansService],
  imports: [
    SpecialtiesModule,
    TypeOrmModule.forFeature([Specialty, HealthPlan]),
  ],
})
export class HealthPlansModule {}
