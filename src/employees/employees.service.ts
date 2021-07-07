import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee, Address } from 'src/database/entities';
import { SpecialtiesService } from 'src/specialties/specialties.service';

import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
import {
  CreateEmployeeResponse,
  UpdateEmployeeResponse,
} from './employees.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private specialtiesService: SpecialtiesService,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({ relations: ['specialty'] });
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeesRepository.findOne(id, {
      relations: ['address', 'specialty'],
    });
  }

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<CreateEmployeeResponse> {
    const employee = await this.employeesRepository.findOne({
      where: { name: createEmployeeDto.name },
    });

    if (employee) {
      if (employee.isActive) {
        throw new HttpException(
          'There is already an employee with this name',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'There is an inactive employee with this name',
        HttpStatus.CONFLICT,
      );
    }

    const specialty = await this.specialtiesService.findOne(
      createEmployeeDto.specialty,
    );
    if (!specialty || !specialty.isActive) {
      throw new HttpException('Specialty not found', HttpStatus.BAD_REQUEST);
    }

    const newAddress = new Address();
    newAddress.city = createEmployeeDto.city;
    newAddress.complement = createEmployeeDto.complement;
    newAddress.neighborhood = createEmployeeDto.neighborhood;
    newAddress.number = createEmployeeDto.number;
    newAddress.state = createEmployeeDto.state;
    newAddress.street = createEmployeeDto.street;
    await this.addressRepository.save(newAddress);

    const newEmployee = new Employee();
    newEmployee.birthdate = createEmployeeDto.birthdate;
    newEmployee.description = createEmployeeDto.description;
    newEmployee.document = createEmployeeDto.document;
    newEmployee.email = createEmployeeDto.email;
    newEmployee.license = createEmployeeDto.license;
    newEmployee.name = createEmployeeDto.name;
    newEmployee.phone = createEmployeeDto.phone;
    newEmployee.photo = createEmployeeDto.photo;
    newEmployee.gender = createEmployeeDto.gender;
    newEmployee.address = newAddress;
    newEmployee.specialty = specialty;
    await this.employeesRepository.save(newEmployee);

    return { id: newEmployee.id };
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeResponse> {
    const employee = await this.employeesRepository.findOne(id, {
      relations: ['address'],
    });

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const employeeWithSameDocument = await this.employeesRepository.findOne({
      where: { document: updateEmployeeDto.document },
    });

    if (
      employeeWithSameDocument &&
      employeeWithSameDocument.id !== employee.id
    ) {
      if (!employeeWithSameDocument.isActive) {
        throw new HttpException(
          'There is inactive employee with this document number',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is already a employee with this document number',
        HttpStatus.CONFLICT,
      );
    }

    const specialty = await this.specialtiesService.findOne(
      updateEmployeeDto.specialty,
    );

    if (!specialty || !specialty.isActive) {
      throw new HttpException('Specialty not found', HttpStatus.BAD_REQUEST);
    }

    const address = await this.addressRepository.findOne(employee.address.id);
    if (!address) {
      throw new HttpException('Address not found', HttpStatus.BAD_REQUEST);
    }

    address.city = updateEmployeeDto.city;
    address.complement = updateEmployeeDto.complement;
    address.neighborhood = updateEmployeeDto.neighborhood;
    address.number = updateEmployeeDto.number;
    address.state = updateEmployeeDto.state;
    address.street = updateEmployeeDto.street;
    await this.addressRepository.save(address);

    employee.birthdate = updateEmployeeDto.birthdate;
    employee.description = updateEmployeeDto.description;
    employee.document = updateEmployeeDto.document;
    employee.email = updateEmployeeDto.email;
    employee.license = updateEmployeeDto.license;
    employee.name = updateEmployeeDto.name;
    employee.phone = updateEmployeeDto.phone;
    employee.photo = updateEmployeeDto.photo;
    employee.gender = updateEmployeeDto.gender;
    employee.address = address;
    employee.specialty = specialty;
    await this.employeesRepository.save(employee);

    return { id: employee.id };
  }

  async delete(id: string): Promise<void> {
    const employee = await this.employeesRepository.findOne(id);

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    employee.isActive = false;
    await this.employeesRepository.save(employee);
  }
}
