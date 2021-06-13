import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthPlan, Specialty } from 'src/database/entities';
import { SpecialtiesService } from 'src/specialties/specialties.service';
import { Repository } from 'typeorm';
import { CreateHealthPlanDto } from './healthPlans.dto';
import { CreateHealthPlanResponse } from './healthPlans.interface';

@Injectable()
export class HealthPlansService {
  constructor(
    @InjectRepository(HealthPlan)
    private healthPlansRepository: Repository<HealthPlan>,
    private specialtiesService: SpecialtiesService,
  ) {}

  findAll(): Promise<HealthPlan[]> {
    return this.healthPlansRepository.find();
  }

  findOne(id: string): Promise<HealthPlan> {
    return this.healthPlansRepository.findOne(id);
  }

  async create(
    createHealthPlanDto: CreateHealthPlanDto,
  ): Promise<CreateHealthPlanResponse> {
    const healthPlan = await this.healthPlansRepository.findOne({
      where: { name: createHealthPlanDto.name },
    });

    if (healthPlan) {
      if (healthPlan.isActive) {
        throw new HttpException(
          'There is already a health plan with this name',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is inactive health plan with this name',
        HttpStatus.CONFLICT,
      );
    }

    const newHealthPlan = new HealthPlan();
    newHealthPlan.name = createHealthPlanDto.name;
    newHealthPlan.isActive = true;

    await this.healthPlansRepository.save(newHealthPlan);

    return { id: newHealthPlan.id };
  }

  async delete(id: string): Promise<void> {
    const healthPlan = await this.healthPlansRepository.findOne({
      where: { id, isActive: true },
    });

    if (!healthPlan) {
      throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
    }

    healthPlan.isActive = false;
    await this.healthPlansRepository.save(healthPlan);
  }
}