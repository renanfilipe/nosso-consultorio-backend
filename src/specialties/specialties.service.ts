import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto, UpdateSpecialtyDto } from './specialties.dto';
import {
  CreateSpecialtyResponse,
  UpdateSpecialtyResponse,
} from './specialties.interface';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
  ) {}

  validateExistence(specialty: Specialty) {
    if (!specialty) {
      throw new HttpException('Specialty not found', HttpStatus.NOT_FOUND);
    }
  }

  findAll(): Promise<Specialty[]> {
    return this.specialtiesRepository.find();
  }

  async findOne(id: string): Promise<Specialty> {
    const specialty = await this.specialtiesRepository.findOne(id);

    this.validateExistence(specialty);

    return specialty;
  }

  async create(
    createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<CreateSpecialtyResponse> {
    const specialty = await this.specialtiesRepository.findOne({
      where: { name: createSpecialtyDto.name },
    });

    if (specialty) {
      if (specialty.isActive) {
        throw new HttpException(
          'There is already a specialty with this name',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'There is inactive specialty with this name',
        HttpStatus.CONFLICT,
      );
    }

    const newSpecialty = new Specialty();
    newSpecialty.name = createSpecialtyDto.name;
    newSpecialty.value = createSpecialtyDto.value;
    await this.specialtiesRepository.save(newSpecialty);

    return { id: newSpecialty.id };
  }

  async update(
    id: string,
    updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<UpdateSpecialtyResponse> {
    const specialty = await this.specialtiesRepository.findOne(id);

    this.validateExistence(specialty);

    const specialtyWithSameName = await this.specialtiesRepository.findOne({
      where: { name: updateSpecialtyDto.name },
    });

    if (specialtyWithSameName && specialtyWithSameName.id !== specialty.id) {
      if (!specialtyWithSameName.isActive) {
        throw new HttpException(
          'There is inactive specialty with this name',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is already a specialty with this name',
        HttpStatus.CONFLICT,
      );
    }

    specialty.name = updateSpecialtyDto.name;
    specialty.value = updateSpecialtyDto.value;
    specialty.isActive = updateSpecialtyDto.isActive;
    await this.specialtiesRepository.save(specialty);

    return { id: specialty.id };
  }

  async delete(id: string): Promise<void> {
    const specialty = await this.specialtiesRepository.findOne(id);

    this.validateExistence(specialty);

    specialty.isActive = false;
    await this.specialtiesRepository.save(specialty);
  }
}
