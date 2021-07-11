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
  Patch,
} from '@nestjs/common';
import {
  CreateHealthPlanDto,
  PatchHealthPlanDto,
  UpdateHealthPlanDto,
} from './healthPlans.dto';
import { HealthPlansService } from './healthPlans.service';
import {
  createHealthPlanSchema,
  patchHealthPlanSchema,
  updateHealthPlanSchema,
} from './healthPlans.schema';
import { HealthPlan } from 'src/database/entities';
import {
  CreateHealthPlanResponse,
  PatchHealthPlanResponse,
  UpdateHealthPlanResponse,
} from './healthPlans.interface';
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

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateHealthPlanSchema))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateHealthPlanDto: UpdateHealthPlanDto,
  ): Promise<UpdateHealthPlanResponse> {
    return this.healthPlansService.update(id, updateHealthPlanDto);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(patchHealthPlanSchema))
  async patch(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() patchHealthPlanDto: PatchHealthPlanDto,
  ): Promise<PatchHealthPlanResponse> {
    return this.healthPlansService.patch(id, patchHealthPlanDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.healthPlansService.delete(id);
  }
}
