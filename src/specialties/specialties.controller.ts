import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSpecialtyDto } from './specialties.dto';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from 'src/database/entities';
import { CreateSpecialtyResponse } from './specialties.interface';

@Controller('specialty')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  async findAll(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Specialty> {
    return this.specialtiesService.findOne(id);
  }

  @Post()
  async create(
    @Body() createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<CreateSpecialtyResponse> {
    return this.specialtiesService.create(createSpecialtyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.specialtiesService.delete(id);
  }
}
