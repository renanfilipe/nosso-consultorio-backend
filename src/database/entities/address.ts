import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { StatesEnum } from './statesEnum';
import { v4 as uuid } from 'uuid';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  addressId: string = uuid();

  @Column({ length: 255, nullable: false })
  street: string;

  @Column({ length: 255, nullable: false })
  number: string;

  @Column({ length: 255, nullable: true })
  complement: string;

  @Column({ length: 255, nullable: true })
  neighborhood: string;

  @Column({ type: 'enum', enum: StatesEnum })
  state: StatesEnum;

  @Column({ length: 255, nullable: true })
  city: string;
}
