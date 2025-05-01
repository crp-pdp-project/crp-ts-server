export abstract class BaseModel {
  toPlainObject(): Record<string, unknown> {
    const plainObject: Record<string, unknown> = {};
    Object.entries(this).forEach(([key, value]) => {
      switch (true) {
        case value instanceof BaseModel:
          plainObject[key] = value.toPlainObject();
          break;
        case Array.isArray(value):
          plainObject[key] = value.map((item) => (item instanceof BaseModel ? item.toPlainObject() : item));
          break;
        default:
          plainObject[key] = value;
          break;
      }
    });

    return plainObject;
  }
}
