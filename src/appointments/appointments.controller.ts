import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';

import { Appointment } from 'src/database/entities';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';

import { CreateAppointmentDto, UpdateAppointmentDto } from './appointments.dto';
import { AppointmentsService } from './appointments.service';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from './appointments.schema';
import {
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
} from './appointments.interface';

@Controller('appointment')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createAppointmentSchema))
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreateAppointmentResponse> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateAppointmentSchema))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<UpdateAppointmentResponse> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }
}
