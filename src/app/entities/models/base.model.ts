export abstract class BaseModel {
  toPlainObject(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    const self = this as Record<string, unknown>;

    for (const key of Object.keys(self)) {
      const value = self[key];
      if (value === undefined) continue;
      out[key] = this.serialize(value);
    }

    const seen = new Set(Object.keys(out));
    for (const key of this.getAllGetterNames()) {
      if (key === 'constructor' || seen.has(key)) continue;
      const value = self[key];
      if (value === undefined) continue;
      out[key] = this.serialize(value);
    }

    return out;
  }

  private isBaseModel(value: unknown): value is BaseModel {
    return value instanceof BaseModel;
  }

  private serialize(value: unknown): unknown {
    if (this.isBaseModel(value)) {
      return value.toPlainObject();
    }

    if (Array.isArray(value)) {
      const result: unknown[] = [];
      for (const nestedValue of value as unknown[]) {
        if (nestedValue === undefined) continue;
        result.push(this.isBaseModel(nestedValue) ? nestedValue.toPlainObject() : nestedValue);
      }
      return result;
    }

    return value;
  }

  private getAllGetterNames(): string[] {
    const names = new Set<string>();
    let proto = Reflect.getPrototypeOf(this);
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        if (desc?.get) names.add(key);
      }
      proto = Reflect.getPrototypeOf(proto);
    }
    return [...names];
  }
}
