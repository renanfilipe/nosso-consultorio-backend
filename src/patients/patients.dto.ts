import { GenderEnum } from 'src/database/entities/enums/genderEnum';
import { StatesEnum } from 'src/database/entities/enums/statesEnum';

export class CreatePatientDto {
  anamnesis?: string;
  birthdate: Date;
  city: string;
  complement?: string;
  document: string;
  email: string;
  emergencyPhone: string;
  gender: GenderEnum;
  name: string;
  neighborhood: string;
  number: string;
  parent?: string;
  phone: string;
  state: StatesEnum;
  street: string;
  healthPlans?: {
    id: string;
    number: string;
  }[];
}

export class UpdatePatientDto {
  anamnesis?: string;
  birthdate: Date;
  city: string;
  complement?: string;
  document: string;
  email: string;
  emergencyPhone: string;
  gender: GenderEnum;
  name: string;
  neighborhood: string;
  number: string;
  parent?: string;
  phone: string;
  state: StatesEnum;
  street: string;
  healthPlan?: string;
  healthPlanNumber?: string;
}

export class PatchPatientDto {
  isActive: boolean;
}
