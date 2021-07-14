import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';

import { CreatePatientDto, UpdatePatientDto } from './patients.dto';
import { PatientsService } from './patients.service';
import { createPatientSchema, updatePatientSchema } from './patients.schema';
import {
  CreatePatientResponse,
  UpdatePatientResponse,
} from './patients.interface';

import { Patient } from 'src/database/entities';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';

@Controller('patient')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createPatientSchema))
  async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<CreatePatientResponse> {
    return this.patientsService.create(createPatientDto);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updatePatientSchema))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdatePatientResponse> {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.patientsService.delete(id);
  }
}
