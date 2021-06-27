import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/database/entities';
import { Repository } from 'typeorm';
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
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
  }

  findOne(id: string): Promise<Employee> {
    return this.employeesRepository.findOne(id);
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

    const newEmployee = new Employee();
    newEmployee.name = createEmployeeDto.name;
    newEmployee.description = createEmployeeDto.description;
    newEmployee.document = createEmployeeDto.document;
    newEmployee.email = createEmployeeDto.email;
    newEmployee.license = createEmployeeDto.license;
    newEmployee.phone = createEmployeeDto.phone;
    newEmployee.photo = createEmployeeDto.photo;
    newEmployee.tags = createEmployeeDto.tags;
    await this.employeesRepository.save(newEmployee);

    return { id: newEmployee.id };
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeResponse> {
    const employee = await this.employeesRepository.findOne(id);

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const employeeWithSameName = await this.employeesRepository.findOne({
      where: { name: updateEmployeeDto.name },
    });

    if (employeeWithSameName && employeeWithSameName.id !== employee.id) {
      if (!employeeWithSameName.isActive) {
        throw new HttpException(
          'There is inactive employee with this name',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'There is already a employee with this name',
        HttpStatus.CONFLICT,
      );
    }

    employee.name = updateEmployeeDto.name;
    employee.name = updateEmployeeDto.name;
    employee.description = updateEmployeeDto.description;
    employee.document = updateEmployeeDto.document;
    employee.email = updateEmployeeDto.email;
    employee.license = updateEmployeeDto.license;
    employee.phone = updateEmployeeDto.phone;
    employee.photo = updateEmployeeDto.photo;
    employee.tags = updateEmployeeDto.tags;
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
