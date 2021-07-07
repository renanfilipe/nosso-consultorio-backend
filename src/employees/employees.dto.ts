import { StatesEnum } from 'src/database/entities/enums/statesEnum';
import { GenderEnum } from 'src/database/entities/enums/genderEnum';

export class CreateEmployeeDto {
  birthdate: Date;
  city: string;
  complement?: string;
  description: string;
  document: string;
  email: string;
  gender: GenderEnum;
  license: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  photo?: string;
  specialty: string;
  state: StatesEnum;
  street: string;
}

export class UpdateEmployeeDto {
  birthdate: Date;
  city: string;
  complement?: string;
  description: string;
  document: string;
  email: string;
  gender: GenderEnum;
  license: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  photo?: string;
  specialty: string;
  state: StatesEnum;
  street: string;
}
