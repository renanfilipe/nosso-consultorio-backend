import { Employee } from 'src/database/entities';

export type CreateEmployeeResponse = Pick<Employee, 'id'>;
export type UpdateEmployeeResponse = CreateEmployeeResponse;
export type PatchEmployeeResponse = CreateEmployeeResponse;
