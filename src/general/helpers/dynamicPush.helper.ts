import { z, ZodObject, ZodRawShape, ZodType } from 'zod';

import { ErrorModel } from 'src/app/entities/models/error/error.model';

import { PushDataTypes } from '../enums/pushDataTypes.enum';

type MapConfig = {
  name: string;
  type: PushDataTypes;
  isRequired?: boolean;
};

export class DynamicPushHelper {
  private static readonly dataTypeMap: Partial<Record<PushDataTypes, ZodType>> = {
    [PushDataTypes.STRING]: z.string(),
    [PushDataTypes.INTEGER]: z.number().int(),
    [PushDataTypes.NUMBER]: z.number(),
    [PushDataTypes.BOOLEAN]: z.boolean(),
  };

  static getPushSchema(config: MapConfig[]): ZodObject<ZodRawShape> {
    const schema = this.buildShape(config);

    return schema;
  }

  private static buildShape(config: MapConfig[]): ZodObject<ZodRawShape> {
    const shape: Record<string, ZodType> = {};

    config.forEach((field) => {
      const zodType = this.dataTypeMap[field.type];
      if (!zodType) {
        throw ErrorModel.notFound({ message: 'Push Config Datatype not found' });
      }
      shape[field.name] = field.isRequired === false ? zodType.optional() : zodType;
    });

    return z.object(shape).strict();
  }
}
