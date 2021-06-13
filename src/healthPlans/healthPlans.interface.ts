import { HealthPlan, Specialty } from 'src/database/entities';

export type CreateHealthPlanResponse = Pick<HealthPlan, 'id'>;
export type UpdateHealthPlanResponse = CreateHealthPlanResponse;
export type PatchHealthPlanResponse = CreateHealthPlanResponse;

export type FindOneHealthPlanResponse = {
  id: string;
  name: string;
  isActive: boolean;
  specialties: {
    id: Specialty;
    value: number;
  }[];
};
