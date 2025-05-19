export abstract class BaseModel {
  toPlainObject(): Record<string, unknown> {
    const plainObject: Record<string, unknown> = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value === undefined) return;

      switch (true) {
        case value instanceof BaseModel:
          plainObject[key] = value.toPlainObject();
          break;
        case Array.isArray(value):
          plainObject[key] = value
            .map((item) => (item instanceof BaseModel ? item.toPlainObject() : (item as unknown)))
            .filter((item) => item !== undefined);
          break;
        default:
          plainObject[key] = value as unknown;
          break;
      }
    });

    return plainObject;
  }
}
