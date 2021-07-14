import { Patient } from 'src/database/entities';

export type CreatePatientResponse = Pick<Patient, 'id'>;
export type UpdatePatientResponse = CreatePatientResponse;
