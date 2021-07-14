import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Address,
  HealthPlan,
  HealthPlanToPatient,
  Patient,
} from 'src/database/entities';
import { HealthPlansService } from 'src/healthPlans/healthPlans.service';

import {
  CreatePatientDto,
  PatchPatientDto,
  UpdatePatientDto,
} from './patients.dto';
import {
  CreatePatientResponse,
  UpdatePatientResponse,
} from './patients.interface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(HealthPlanToPatient)
    private healthPlanToPatientRepository: Repository<HealthPlanToPatient>,
    private healthPlansService: HealthPlansService,
  ) {}

  validateExistence(patient: Patient) {
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
  }

  findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      relations: ['healthPlanToPatients'],
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne(id, {
      relations: ['address', 'parentPatientId', 'healthPlanToPatients'],
    });

    this.validateExistence(patient);

    return patient;
  }

  async create(
    createPatientDto: CreatePatientDto,
  ): Promise<CreatePatientResponse> {
    const patient = await this.patientsRepository.findOne({
      where: { document: createPatientDto.document },
    });

    if (patient) {
      if (patient.isActive) {
        throw new HttpException(
          'There is already a patient with this document number',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'There is an inactive patient with this document number',
        HttpStatus.CONFLICT,
      );
    }

    let parent: Patient = null;
    if (createPatientDto.parent) {
      parent = await this.patientsRepository.findOne(createPatientDto.parent);

      if (!parent || !parent.isActive) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }
    }

    let healthPlan: HealthPlan = null;
    if (createPatientDto.healthPlan) {
      healthPlan = await this.healthPlansService.findOne(
        createPatientDto.healthPlan,
      );

      if (!healthPlan.isActive) {
        throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
      }
    }

    const newAddress = new Address();
    newAddress.city = createPatientDto.city;
    newAddress.complement = createPatientDto.complement;
    newAddress.neighborhood = createPatientDto.neighborhood;
    newAddress.number = createPatientDto.number;
    newAddress.state = createPatientDto.state;
    newAddress.street = createPatientDto.street;
    await this.addressRepository.save(newAddress);

    const newPatient = new Patient();
    newPatient.address = newAddress;
    newPatient.anamnesis = createPatientDto.anamnesis;
    newPatient.birthdate = createPatientDto.birthdate;
    newPatient.document = createPatientDto.document;
    newPatient.email = createPatientDto.email;
    newPatient.emergencyPhone = createPatientDto.emergencyPhone;
    newPatient.gender = createPatientDto.gender;
    newPatient.name = createPatientDto.name;
    newPatient.parentPatientId = parent;
    newPatient.phone = createPatientDto.phone;
    await this.patientsRepository.save(newPatient);

    if (healthPlan) {
      const healthPlanToPatient = new HealthPlanToPatient();
      healthPlanToPatient.number = createPatientDto.healthPlanNumber;
      healthPlanToPatient.patient = newPatient;
      healthPlanToPatient.healthPlan = healthPlan;
      this.healthPlanToPatientRepository.save(healthPlanToPatient);
    }

    return { id: newPatient.id };
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<UpdatePatientResponse> {
    const patient = await this.patientsRepository.findOne(id);

    this.validateExistence(patient);

    const patientWithSameDocument = await this.patientsRepository.findOne({
      where: { document: updatePatientDto.document },
    });

    if (patientWithSameDocument && patientWithSameDocument.id !== patient.id) {
      if (!patientWithSameDocument.isActive) {
        throw new HttpException(
          'There is inactive patient with this document number',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is already a patient with this document number',
        HttpStatus.CONFLICT,
      );
    }

    let parent: Patient = null;
    if (updatePatientDto.parent) {
      parent = await this.patientsRepository.findOne(updatePatientDto.parent);

      if (!parent || !parent.isActive) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }
    }

    let healthPlan: HealthPlan = null;
    if (updatePatientDto.healthPlan) {
      healthPlan = await this.healthPlansService.findOne(
        updatePatientDto.healthPlan,
      );

      if (!healthPlan.isActive) {
        throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
      }
    }

    patient.name = updatePatientDto.name;
    await this.patientsRepository.save(patient);

    return { id: patient.id };
  }

  async patch(
    id: string,
    patchPatientDto: PatchPatientDto,
  ): Promise<UpdatePatientResponse> {
    const patient = await this.patientsRepository.findOne(id);

    this.validateExistence(patient);

    patient.isActive = patchPatientDto.isActive;
    await this.patientsRepository.save(patient);

    return { id: patient.id };
  }

  async delete(id: string): Promise<void> {
    const patient = await this.patientsRepository.findOne(id);

    this.validateExistence(patient);

    patient.isActive = false;
    await this.patientsRepository.save(patient);
  }
}
