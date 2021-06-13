export class CreateHealthPlanDto {
  name: string;
  specialties: {
    id: string;
    value: number;
  }[];
}
