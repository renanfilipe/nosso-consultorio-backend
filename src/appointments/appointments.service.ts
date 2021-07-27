import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment, HealthPlan } from 'src/database/entities';
import { EmployeesService } from 'src/employees/employees.service';
import { PatientsService } from 'src/patients/patients.service';
import { HealthPlansService } from 'src/healthPlans/healthPlans.service';
import { appointmentStatusEnum } from 'src/database/entities/enums/appointmentStatusEnum';

import { CreateAppointmentDto, UpdateAppointmentDto } from './appointments.dto';
import {
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
} from './appointments.interface';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private employeesService: EmployeesService,
    private patientsService: PatientsService,
    private healthPlansService: HealthPlansService,
  ) {}

  validateExistence(appointment: Appointment) {
    if (!appointment) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['patient', 'employee'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne(id, {
      relations: ['employee', 'healthPlan', 'patient'],
    });

    this.validateExistence(appointment);

    return appointment;
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreateAppointmentResponse> {
    const employee = await this.employeesService.findOne(
      createAppointmentDto.employeeId,
    );
    if (!employee.isActive) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const appointmentWithSameDate = await this.appointmentsRepository.findOne({
      where: {
        employee,
        date: createAppointmentDto.date,
        status: appointmentStatusEnum.registered,
      },
    });
    if (appointmentWithSameDate) {
      throw new HttpException(
        'Appointment date not available',
        HttpStatus.CONFLICT,
      );
    }

    const patient = await this.patientsService.findOne(
      createAppointmentDto.patientId,
    );
    if (!patient.isActive) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    let healthPlan: HealthPlan;
    if (createAppointmentDto.healthPlanId) {
      healthPlan = await this.healthPlansService.findOne(
        createAppointmentDto.healthPlanId,
      );
      if (!employee.isActive) {
        throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
      }
    }

    const newAppointment = new Appointment();
    newAppointment.date = createAppointmentDto.date;
    newAppointment.additionalInfo = createAppointmentDto.additionalInfo;
    newAppointment.patient = patient;
    newAppointment.employee = employee;
    newAppointment.healthPlan = healthPlan;
    newAppointment.status = createAppointmentDto.status;
    await this.appointmentsRepository.save(newAppointment);

    return { id: newAppointment.id };
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<UpdateAppointmentResponse> {
    const appointment = await this.appointmentsRepository.findOne(id);

    this.validateExistence(appointment);

    const patient = await this.patientsService.findOne(
      updateAppointmentDto.patientId,
    );
    if (!patient.isActive) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    const employee = await this.employeesService.findOne(
      updateAppointmentDto.employeeId,
    );
    if (!employee.isActive) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    let healthPlan: HealthPlan;
    if (updateAppointmentDto.healthPlanId) {
      healthPlan = await this.healthPlansService.findOne(
        updateAppointmentDto.healthPlanId,
      );
      if (!employee.isActive) {
        throw new HttpException('Health plan not found', HttpStatus.NOT_FOUND);
      }
    }

    const appointmentWithSameDate = await this.appointmentsRepository.findOne({
      where: {
        employee,
        date: updateAppointmentDto.date,
        status: appointmentStatusEnum.registered,
      },
    });
    if (
      appointmentWithSameDate &&
      appointmentWithSameDate.id !== appointment.id
    ) {
      throw new HttpException(
        'Appointment date not available',
        HttpStatus.CONFLICT,
      );
    }

    appointment.date = updateAppointmentDto.date;
    appointment.additionalInfo = updateAppointmentDto.additionalInfo;
    appointment.patient = patient;
    appointment.employee = employee;
    appointment.healthPlan = healthPlan;
    appointment.status = appointment.status;
    await this.appointmentsRepository.save(appointment);

    return { id: appointment.id };
  }
}
