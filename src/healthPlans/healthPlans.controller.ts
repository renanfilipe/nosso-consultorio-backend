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
import { CreateHealthPlanDto } from './healthPlans.dto';
import { HealthPlansService } from './healthPlans.service';
import { createHealthPlanSchema } from './healthPlans.schema';
import { HealthPlan } from 'src/database/entities';
import { CreateHealthPlanResponse } from './healthPlans.interface';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';

@Controller('health-plan')
export class HealthPlansController {
  constructor(private readonly healthPlansService: HealthPlansService) {}

  @Get()
  async findAll(): Promise<HealthPlan[]> {
    return this.healthPlansService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<HealthPlan> {
    return this.healthPlansService.findOne(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createHealthPlanSchema))
  async create(
    @Body() createHealthPlanDto: CreateHealthPlanDto,
  ): Promise<CreateHealthPlanResponse> {
    return this.healthPlansService.create(createHealthPlanDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.healthPlansService.delete(id);
  }
}
