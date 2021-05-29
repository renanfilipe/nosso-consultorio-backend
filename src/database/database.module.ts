import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Appointment,
  Employee,
  HealthPlan,
  HealthPlanToEmployee,
  HealthPlanToPatient,
  HealthPlanToSpecialty,
  Invoice,
  Outcome,
  Patient,
  Specialty,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      synchronize: true,
      entities: [
        Address,
        Appointment,
        Employee,
        HealthPlan,
        HealthPlanToEmployee,
        HealthPlanToPatient,
        HealthPlanToSpecialty,
        Invoice,
        Outcome,
        Patient,
        Specialty,
      ],
    }),
  ],
})
export class DatabaseModule {}
