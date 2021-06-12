import { Specialty } from 'src/database/entities';

export type CreateSpecialtyResponse = Pick<Specialty, 'id'>;
export type UpdateSpecialtyResponse = CreateSpecialtyResponse;
