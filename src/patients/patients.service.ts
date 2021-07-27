import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Address, HealthPlanToPatient, Patient } from 'src/database/entities';
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

    let parentPatient: Patient = null;
    if (createPatientDto.parentPatientId) {
      parentPatient = await this.patientsRepository.findOne(
        createPatientDto.parentPatientId,
      );

      if (!parentPatient || !parentPatient.isActive) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }
    }

    const healthPlansToPatient: HealthPlanToPatient[] = [];
    if (createPatientDto.healthPlans) {
      await Promise.all(
        createPatientDto.healthPlans.map(async (item) => {
          const healthPlan = await this.healthPlansService.findOne(item.id);
          if (!healthPlan.isActive) {
            throw new HttpException(
              'Health plan not found',
              HttpStatus.BAD_REQUEST,
            );
          }
          const healthPlanToPatient = new HealthPlanToPatient();
          healthPlanToPatient.healthPlan = healthPlan;
          healthPlanToPatient.number = item.number;
          healthPlansToPatient.push(healthPlanToPatient);
        }),
      );
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
    newPatient.parentPatientId = parentPatient;
    newPatient.phone = createPatientDto.phone;
    await this.patientsRepository.save(newPatient);

    if (healthPlansToPatient.length) {
      await Promise.all(
        healthPlansToPatient.map(async (healthPlanToPatient) => {
          healthPlanToPatient.patient = newPatient;
          await this.healthPlanToPatientRepository.save(healthPlanToPatient);
        }),
      );
    }

    return { id: newPatient.id };
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<UpdatePatientResponse> {
    const patient = await this.patientsRepository.findOne(id, {
      relations: ['address', 'parentPatientId'],
    });

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

    let parentPatient: Patient = null;
    if (updatePatientDto.parentPatientId) {
      parentPatient = await this.patientsRepository.findOne(
        updatePatientDto.parentPatientId,
      );

      if (!parentPatient || !parentPatient.isActive) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }
    }

    const allHealthPlansToPatient =
      await this.healthPlanToPatientRepository.find({
        where: { patient },
        relations: ['patient'],
      });

    await Promise.all(
      allHealthPlansToPatient.map(async (item) => {
        item.isActive = false;
        await this.healthPlanToPatientRepository.save(item);
      }),
    );

    if (updatePatientDto.healthPlans) {
      await Promise.all(
        updatePatientDto.healthPlans.map(async (item) => {
          const healthPlan = await this.healthPlansService.findOne(item.id);
          if (!healthPlan.isActive) {
            return;
          }

          const healthPlanToPatient =
            (await this.healthPlanToPatientRepository.findOne({
              where: { patient, healthPlan },
              relations: ['patient'],
            })) || new HealthPlanToPatient();
          healthPlanToPatient.healthPlan = healthPlan;
          healthPlanToPatient.patient = patient;
          healthPlanToPatient.number = item.number;
          healthPlanToPatient.isActive = true;
          await this.healthPlanToPatientRepository.save(healthPlanToPatient);
        }),
      );
    }

    const address = await this.addressRepository.findOne(patient.address.id);
    if (!address) {
      throw new HttpException('Address not found', HttpStatus.BAD_REQUEST);
    }

    address.city = updatePatientDto.city;
    address.complement = updatePatientDto.complement;
    address.neighborhood = updatePatientDto.neighborhood;
    address.number = updatePatientDto.number;
    address.state = updatePatientDto.state;
    address.street = updatePatientDto.street;
    await this.addressRepository.save(address);

    patient.address = address;
    patient.anamnesis = updatePatientDto.anamnesis;
    patient.birthdate = updatePatientDto.birthdate;
    patient.document = updatePatientDto.document;
    patient.email = updatePatientDto.email;
    patient.emergencyPhone = updatePatientDto.emergencyPhone;
    patient.gender = updatePatientDto.gender;
    patient.name = updatePatientDto.name;
    patient.parentPatientId = parentPatient;
    patient.phone = updatePatientDto.phone;

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
