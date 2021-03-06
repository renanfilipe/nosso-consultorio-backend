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
  CreateEmployeeDto,
  PatchEmployeeDto,
  UpdateEmployeeDto,
} from './employees.dto';
import { EmployeesService } from './employees.service';
import {
  createEmployeeSchema,
  patchEmployeeSchema,
  updateEmployeeSchema,
} from './employees.schema';
import { Employee } from 'src/database/entities';
import {
  CreateEmployeeResponse,
  PatchEmployeeResponse,
  UpdateEmployeeResponse,
} from './employees.interface';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';

@Controller('employee')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createEmployeeSchema))
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<CreateEmployeeResponse> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateEmployeeSchema))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeResponse> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(patchEmployeeSchema))
  async patch(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() patchEmployeeDto: PatchEmployeeDto,
  ): Promise<PatchEmployeeResponse> {
    return this.employeesService.patch(id, patchEmployeeDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.employeesService.delete(id);
  }
}
