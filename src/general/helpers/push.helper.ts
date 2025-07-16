import { z, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from 'zod';

import { SendDeepLinkNotificationBodyDTOSchema } from 'src/app/entities/dtos/input/sendDeepLinkNotification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';

import { PushDataTypes } from '../enums/pushDataTypes.enum';

type MapConfig = {
  name: string;
  type: PushDataTypes;
  isRequired?: boolean;
};

export class PushHelper {
  private static readonly dataTypeMap: Partial<Record<PushDataTypes, ZodTypeAny>> = {
    [PushDataTypes.STRING]: z.string(),
    [PushDataTypes.INTEGER]: z.number().int(),
    [PushDataTypes.NUMBER]: z.number(),
    [PushDataTypes.BOOLEAN]: z.boolean(),
  };

  static getPushSchema(config: MapConfig[]): ZodSchema {
    const extension = this.buildShape(config);
    const extendedSchema = SendDeepLinkNotificationBodyDTOSchema.extend({
      params: extension,
    });

    return extendedSchema;
  }

  private static buildShape(config: MapConfig[]): ZodObject<ZodRawShape> {
    const rawShape = config.reduce<ZodRawShape>((acc, field) => {
      const zodType = this.dataTypeMap[field.type];
      if (!zodType) {
        throw ErrorModel.notFound({ message: 'Push Config Datatype not found' });
      }

      acc[field.name] = field.isRequired === false ? zodType.optional() : zodType;

      return acc;
    }, {});

    return z.object(rawShape).strict();
  }
}
