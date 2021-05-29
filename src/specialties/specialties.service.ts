import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto } from './specialties.dto';
import { CreateSpecialtyResponse } from './specialties.interface';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
  ) {}

  findAll(): Promise<Specialty[]> {
    return this.specialtiesRepository.find({ where: { isActive: true } });
  }

  findOne(id: string): Promise<Specialty> {
    return this.specialtiesRepository.findOne({
      where: { id, isActive: true },
    });
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
          'Specialty already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      specialty.value = createSpecialtyDto.value;
      specialty.isActive = true;
      await this.specialtiesRepository.save(specialty);
      return { id: specialty.id };
    }

    const newSpecialty = new Specialty();
    newSpecialty.name = createSpecialtyDto.name;
    newSpecialty.value = createSpecialtyDto.value;
    await this.specialtiesRepository.save(newSpecialty);

    return { id: newSpecialty.id };
  }

  async delete(id: string): Promise<void> {
    const specialty = await this.specialtiesRepository.findOne({
      where: { id, isActive: true },
    });

    if (!specialty) {
      throw new HttpException('Specialty not found', HttpStatus.NOT_FOUND);
    }

    specialty.isActive = false;
    await this.specialtiesRepository.save(specialty);
  }
}
