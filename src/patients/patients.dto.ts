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
  parentPatientId?: string;
  phone: string;
  state: StatesEnum;
  street: string;
  healthPlans?: {
    id: string;
    number: string;
  }[];
}

export class UpdatePatientDto extends CreatePatientDto {}

export class PatchPatientDto {
  isActive: boolean;
}
