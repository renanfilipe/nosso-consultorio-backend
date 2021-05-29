import { ObjectSchema } from '@hapi/joi';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown) {
    const { error } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
