import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [PatientsModule, DatabaseModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
