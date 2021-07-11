import { HealthPlan } from 'src/database/entities';

export type CreateHealthPlanResponse = Pick<HealthPlan, 'id'>;
export type UpdateHealthPlanResponse = CreateHealthPlanResponse;
export type PatchHealthPlanResponse = CreateHealthPlanResponse;
