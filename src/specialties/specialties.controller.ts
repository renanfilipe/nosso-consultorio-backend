import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateSpecialtyDto } from './specialties.dto';
import { SpecialtiesService } from './specialties.service';
import { createSpecialtySchema } from './specialties.schema';
import { Specialty } from 'src/database/entities';
import { CreateSpecialtyResponse } from './specialties.interface';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';

@Controller('specialty')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  async findAll(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Specialty> {
    return this.specialtiesService.findOne(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createSpecialtySchema))
  async create(
    @Body() createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<CreateSpecialtyResponse> {
    return this.specialtiesService.create(createSpecialtyDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.specialtiesService.delete(id);
  }
}
