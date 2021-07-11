import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthPlan, HealthPlanToSpecialty } from 'src/database/entities';
import { SpecialtiesService } from 'src/specialties/specialties.service';
import { Repository } from 'typeorm';
import {
  CreateHealthPlanDto,
  PatchHealthPlanDto,
  UpdateHealthPlanDto,
} from './healthPlans.dto';
import {
  CreateHealthPlanResponse,
  UpdateHealthPlanResponse,
} from './healthPlans.interface';

@Injectable()
export class HealthPlansService {
  constructor(
    @InjectRepository(HealthPlan)
    private healthPlansRepository: Repository<HealthPlan>,
    @InjectRepository(HealthPlanToSpecialty)
    private healthPlanToSpecialtiesRepository: Repository<HealthPlanToSpecialty>,
    private specialtiesService: SpecialtiesService,
  ) {}

  findAll(): Promise<HealthPlan[]> {
    return this.healthPlansRepository.find();
  }

  validateExistence(healthPlan: HealthPlan) {
    if (!healthPlan) {
      throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: string): Promise<HealthPlan> {
    const healthPlan = await this.healthPlansRepository.findOne(id, {
      relations: ['healthPlanToSpecialties'],
    });

    this.validateExistence(healthPlan);

    return healthPlan;
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

    await Promise.all(
      createHealthPlanDto.specialties.map(async (item) => {
        const specialty = await this.specialtiesService.findOne(item.id);
        const healthPlanToSpecialty = new HealthPlanToSpecialty();
        healthPlanToSpecialty.specialty = specialty;
        healthPlanToSpecialty.healthPlan = newHealthPlan;
        healthPlanToSpecialty.value = item.value;
        await this.healthPlanToSpecialtiesRepository.save(
          healthPlanToSpecialty,
        );
      }),
    );

    return { id: newHealthPlan.id };
  }

  async update(
    id: string,
    updateSpecialtyDto: UpdateHealthPlanDto,
  ): Promise<UpdateHealthPlanResponse> {
    const healthPlan = await this.healthPlansRepository.findOne(id);

    this.validateExistence(healthPlan);

    const healthPlanWithSameName = await this.healthPlansRepository.findOne({
      where: { name: updateSpecialtyDto.name },
    });

    if (healthPlanWithSameName && healthPlanWithSameName.id !== healthPlan.id) {
      if (!healthPlanWithSameName.isActive) {
        throw new HttpException(
          'There is inactive health plan with this name',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is already a health plan with this name',
        HttpStatus.CONFLICT,
      );
    }

    healthPlan.name = updateSpecialtyDto.name;
    await this.healthPlansRepository.save(healthPlan);

    const allHealthPlanToSpecialties =
      await this.healthPlanToSpecialtiesRepository.find({
        where: { healthPlan },
        relations: ['healthPlan'],
      });

    await Promise.all(
      allHealthPlanToSpecialties.map(async (item) => {
        item.isActive = false;
        await this.healthPlanToSpecialtiesRepository.save(item);
      }),
    );

    await Promise.all(
      updateSpecialtyDto.specialties.map(async ({ id, value }) => {
        const specialty = await this.specialtiesService.findOne(id);

        if (!specialty) {
          return;
        }

        const healthPlanToSpecialty =
          (await this.healthPlanToSpecialtiesRepository.findOne({
            where: { specialty, healthPlan },
          })) || new HealthPlanToSpecialty();

        healthPlanToSpecialty.value = value;
        healthPlanToSpecialty.healthPlan = healthPlan;
        healthPlanToSpecialty.specialty = specialty;
        healthPlanToSpecialty.isActive = true;
        await this.healthPlanToSpecialtiesRepository.save(
          healthPlanToSpecialty,
        );
      }),
    );

    return { id: healthPlan.id };
  }

  async patch(
    id: string,
    patchSpecialtyDto: PatchHealthPlanDto,
  ): Promise<UpdateHealthPlanResponse> {
    const healthPlan = await this.healthPlansRepository.findOne(id);

    this.validateExistence(healthPlan);

    healthPlan.isActive = patchSpecialtyDto.isActive;
    await this.healthPlansRepository.save(healthPlan);

    return { id: healthPlan.id };
  }

  async delete(id: string): Promise<void> {
    const healthPlan = await this.healthPlansRepository.findOne({
      where: { id, isActive: true },
    });

    this.validateExistence(healthPlan);

    healthPlan.isActive = false;
    await this.healthPlansRepository.save(healthPlan);
  }
}
