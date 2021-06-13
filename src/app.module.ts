import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { SpecialtiesModule } from './specialties/specialties.module';
import { HealthPlansModule } from './healthPlans/healthPlans.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SpecialtiesModule, HealthPlansModule, DatabaseModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
