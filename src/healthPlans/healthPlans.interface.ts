import { HealthPlan } from 'src/database/entities';

export type CreateHealthPlanResponse = Pick<HealthPlan, 'id'>;
