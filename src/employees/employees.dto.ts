import { StatesEnum } from 'src/database/entities/statesEnum';

export class CreateEmployeeDto {
  birthdate: Date;
  city: string;
  complement?: string;
  description: string;
  document: string;
  email: string;
  gender: string;
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
  name: string;
  phone: string;
  email: string;
  document: string;
  license: string;
  photo: string;
  description: string;
}
