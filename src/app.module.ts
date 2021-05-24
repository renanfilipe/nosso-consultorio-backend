import {
  Address,
  HealthPlan,
  HealthPlanToPatient,
  HealthPlanToSpecialty,
  Patient,
  Specialty,
} from './entities';

import { ConfigModule } from '@nestjs/config';
import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        Patient,
        HealthPlan,
        Specialty,
        HealthPlanToSpecialty,
        HealthPlanToPatient,
      ],
    }),
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
