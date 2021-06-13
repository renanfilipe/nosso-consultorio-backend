export class CreateHealthPlanDto {
  name: string;
  specialties: {
    id: string;
    value: number;
  }[];
}

export class UpdateHealthPlanDto {
  name: string;
  specialties: {
    id: string;
    value: number;
  }[];
}

export class PatchHealthPlanDto {
  isActive: boolean;
}
