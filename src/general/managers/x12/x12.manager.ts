import { ErrorModel } from 'src/app/entities/models/error/error.model';

export type Location = {
  tag: string;
  element: number;
  component?: number;
  occurrence: number;
};

export type ChildLocation = {
  startTag: string;
  startOccurrence: number;
  endTag: string;
  endOccurrence: number;
  config: X12ManagerConfig;
};

export type FieldMap<T> = {
  [K in keyof T]: Location[] | ChildLocation;
};
export type Segment = string[];
export type OccurrenceMap = Record<number, Segment>;
export type SegmentStore = Record<string, OccurrenceMap>;

export abstract class X12ManagerConfig<T = Record<string, unknown>> {
  abstract readonly segmentDelimiter: string;
  abstract readonly elementDelimiter: string;
  abstract readonly componentDelimiter: string;
  abstract readonly segmentSequence: string[];
  abstract readonly segmentLength: Record<string, number>;
  abstract readonly fieldMap: FieldMap<T>;
}

export interface IX12Manager<Input, Output> {
  encode(payload: Input): string;
  decode(x12: string): Output;
}

type InferType<Config> = Config extends X12ManagerConfig<infer Type> ? Type : never;

export class X12Manager<EncodeConf extends X12ManagerConfig, DecodeConf extends X12ManagerConfig>
  implements IX12Manager<InferType<EncodeConf>, InferType<DecodeConf>>
{
  private readonly encodeConfig: EncodeConf;
  private readonly decodeConfig: DecodeConf;

  constructor(encodeConfig: EncodeConf, decodeConfig?: DecodeConf) {
    this.encodeConfig = encodeConfig;
    this.decodeConfig = (decodeConfig ?? encodeConfig) as DecodeConf;
  }

  encode(payload: InferType<EncodeConf>): string {
    const segmentStore: SegmentStore = this.buildSegmentStore(payload);
    const preEncodedX12: string = this.serializeStoreToX12(segmentStore);
    const encodedX12: string = this.serializeChildsToX12(payload, preEncodedX12);

    return encodedX12;
  }

  decode(x12: string): InferType<DecodeConf> {
    const normalized: string = this.normalizeX12(x12);
    const segmentStore: SegmentStore = this.parseX12ToStore(normalized);
    const decodedX12: Record<string, unknown> = this.extractDtoFromStore(segmentStore);
    const decodedChildren: Record<string, unknown[]> = this.decodeAllChildrens(normalized);

    for (const [key, child] of Object.entries(decodedChildren)) {
      decodedX12[key] = child;
    }

    return decodedX12 as InferType<DecodeConf>;
  }

  private isPrimitive(value: unknown): value is string | number | boolean {
    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
  }

  private isChildLocation(value: Location[] | ChildLocation): value is ChildLocation {
    return !Array.isArray(value) && typeof value.config === 'object';
  }

  private isLocationArray(value: Location[] | ChildLocation): value is Location[] {
    return Array.isArray(value);
  }

  private makeSegmentElements(tag: string, firstValue: number): Segment {
    const length = this.encodeConfig.segmentLength[tag];
    const elementsArray = new Array<string>(length).fill('');
    elementsArray[0] = String(firstValue);
    return elementsArray;
  }

  private buildSegmentStore(payload: InferType<EncodeConf>): SegmentStore {
    const segmentStore: SegmentStore = {};
    const countsByTag: Record<string, number> = {};

    for (const tag of this.encodeConfig.segmentSequence) {
      const next = (countsByTag[tag] ?? 0) + 1;
      countsByTag[tag] = next;

      const occurrenceMap = (segmentStore[tag] ??= {});
      occurrenceMap[next] = this.makeSegmentElements(tag, next);
    }

    for (const key of Object.keys(this.encodeConfig.fieldMap)) {
      const value = payload[key] ?? '';
      if (!this.isPrimitive(value)) continue;

      const mapping = this.encodeConfig.fieldMap[key];
      if (!mapping || !this.isLocationArray(mapping)) continue;

      for (const location of mapping) {
        this.putValueIntoStore(segmentStore, String(value), location);
      }
    }

    return segmentStore;
  }

  private putValueIntoStore(segmentStore: SegmentStore, value: string, location: Location): void {
    if (value == null) return;

    const elementTrueIndex = location.element - 1;
    const occurrenceNumber = location.occurrence ?? 1;
    const occurrenceMap = segmentStore[location.tag];
    const elements = occurrenceMap?.[occurrenceNumber];

    if (!elements) {
      throw ErrorModel.server({ message: `Occurrence ${occurrenceNumber} for tag ${location.tag} not found` });
    }

    let valueToInsert = value;

    if (location.component && location.component > 0) {
      const current = elements[elementTrueIndex] ?? '';
      const components = current ? current.split(this.encodeConfig.componentDelimiter) : [];
      const componentTrueIndex = location.component - 1;

      while (components.length <= componentTrueIndex) {
        components.push('');
      }

      components[componentTrueIndex] = value;
      valueToInsert = components.join(this.encodeConfig.componentDelimiter);
    }

    elements[elementTrueIndex] = valueToInsert;
  }

  private readValueFromStore(segmentStore: SegmentStore, location: Location): string | undefined {
    const elementTrueIndex = location.element - 1;
    const occurrenceNumber = location.occurrence ?? 1;
    const occurrenceMap = segmentStore[location.tag];
    const elements = occurrenceMap?.[occurrenceNumber];

    if (!elements) return undefined;

    const raw = elements[elementTrueIndex];

    if (raw == null || raw === '') return undefined;

    if (location.component && location.component > 0) {
      const parts = raw.split(this.decodeConfig.componentDelimiter);
      return parts[location.component - 1];
    }

    return raw;
  }

  private extractDtoFromStore(segmentStore: SegmentStore): InferType<DecodeConf> {
    const output: Record<string, unknown> = {};

    for (const [key, mapping] of Object.entries(this.decodeConfig.fieldMap)) {
      if (!this.isLocationArray(mapping)) continue;

      let selectedValue: string | undefined = undefined;

      for (const location of mapping) {
        const candidate = this.readValueFromStore(segmentStore, location)?.trim();
        if (candidate) {
          selectedValue = candidate;
          break;
        }
      }

      output[key] = selectedValue;
    }

    return output as InferType<DecodeConf>;
  }

  private decodeAllChildrens(x12: string): Record<string, unknown[]> {
    const decodedChildren: Record<string, unknown[]> = {};

    for (const [key, mapping] of Object.entries(this.decodeConfig.fieldMap)) {
      if (!this.isChildLocation(mapping)) continue;

      const slice = this.sliceChild(x12, mapping);
      if (!slice) continue;

      const childItemChunks = this.splitChildSliceIntoItems(slice, mapping);

      if (childItemChunks.length === 0) continue;

      const childManager = new X12Manager(mapping.config);
      const decodedArray: unknown[] = [];

      for (const chunk of childItemChunks) {
        const item = childManager.decode(chunk);
        decodedArray.push(item);
      }

      decodedChildren[key] = decodedArray;
    }

    return decodedChildren;
  }

  private serializeStoreToX12(segmentStore: SegmentStore): string {
    const { elementDelimiter, segmentDelimiter } = this.encodeConfig;
    const countsByTag: Record<string, number> = {};
    const orderedKeysCache: Record<string, number[]> = {};

    let buffer = '';
    let emittedThisPass = true;

    while (emittedThisPass) {
      emittedThisPass = false;

      for (const tag of this.encodeConfig.segmentSequence) {
        const occurrenceMap = segmentStore[tag];

        if (!occurrenceMap) continue;

        const orderedKeys = (orderedKeysCache[tag] ??= Object.keys(occurrenceMap)
          .map(Number)
          .filter((k) => Number.isFinite(k))
          .sort((a, b) => a - b));

        const nextIndex = countsByTag[tag] ?? 0;
        const occurrenceNumber = orderedKeys[nextIndex];
        const elements = occurrenceNumber != null ? occurrenceMap[occurrenceNumber] : undefined;

        if (elements) {
          const textSegment = [tag, ...elements].join(elementDelimiter);
          buffer += `${textSegment} ${segmentDelimiter}`;
          countsByTag[tag] = nextIndex + 1;
          emittedThisPass = true;
        }
      }
    }

    return buffer;
  }

  private serializeChildsToX12(payload: InferType<EncodeConf>, x12: string): string {
    let completeX12 = x12;

    for (const [key, mapping] of Object.entries(this.encodeConfig.fieldMap)) {
      if (!this.isChildLocation(mapping)) continue;

      const childPayloadAny = payload[key] as Record<string, unknown>[];
      if (childPayloadAny == null) continue;

      const childItems = Array.isArray(childPayloadAny) ? childPayloadAny : [childPayloadAny];
      if (childItems.length === 0) continue;

      const childManager = new X12Manager(mapping.config);

      let childFragment = '';
      for (const item of childItems) {
        childFragment += childManager.encode(item);
      }

      completeX12 = this.insertBeforeChildEnd(completeX12, mapping, childFragment);
    }

    return completeX12;
  }

  private parseX12ToStore(x12: string): SegmentStore {
    const { segmentDelimiter, elementDelimiter } = this.decodeConfig;
    const segmentStore: SegmentStore = {};
    const countsByTag: Record<string, number> = {};

    const rawSegments = x12.split(segmentDelimiter).filter(Boolean);

    for (const segmentText of rawSegments) {
      const parts = segmentText.trim().split(elementDelimiter);
      const tag = parts[0];
      const elements = parts.slice(1);

      const occurrenceMap = (segmentStore[tag] ??= {});
      const next = (countsByTag[tag] ?? 0) + 1;
      occurrenceMap[next] = elements;
      countsByTag[tag] = next;
    }
    return segmentStore;
  }

  private insertBeforeChildEnd(x12: string, child: ChildLocation, fragment: string): string {
    const { segmentDelimiter, elementDelimiter } = this.encodeConfig;
    const normalizedDelimiter = ` ${segmentDelimiter}`;
    const rawSegments = x12.split(segmentDelimiter).filter(Boolean);

    let seen = 0;
    let endIndex = rawSegments.length;

    for (const [index, segment] of rawSegments.entries()) {
      if (segment.startsWith(`${child.endTag}${elementDelimiter}`)) {
        seen += 1;
        if (seen === child.endOccurrence) {
          endIndex = index;
          break;
        }
      }
    }

    const fragmentSegments = fragment.split(segmentDelimiter).filter(Boolean);

    rawSegments.splice(endIndex, 0, ...fragmentSegments);
    return `${rawSegments.join(normalizedDelimiter)}${normalizedDelimiter}`;
  }

  private sliceChild(x12: string, child: ChildLocation): string | undefined {
    const { segmentDelimiter, elementDelimiter } = this.encodeConfig;
    const rawSegments = x12.split(segmentDelimiter).filter(Boolean);

    let startIndex = -1;
    let endIndex = -1;
    let startSeen = 0;
    let endSeen = 0;

    for (const [index, segment] of rawSegments.entries()) {
      if (segment.startsWith(`${child.startTag}${elementDelimiter}`)) {
        startSeen += 1;
        if (startSeen === child.startOccurrence) {
          startIndex = index + 1;
        }
      }
      if (segment.startsWith(`${child.endTag}${elementDelimiter}`)) {
        endSeen += 1;
        if (endSeen === child.endOccurrence) {
          endIndex = index;
          if (startIndex >= 0) break;
        }
      }
    }

    if (!startIndex || !endIndex || endIndex <= startIndex) return undefined;

    const slice = rawSegments.slice(startIndex, endIndex).join(segmentDelimiter);
    return slice ? `${slice}${segmentDelimiter}` : undefined;
  }

  private splitChildSliceIntoItems(childX12: string, child: ChildLocation): string[] {
    const { segmentDelimiter, elementDelimiter } = this.decodeConfig;
    const rawSegments = childX12.split(segmentDelimiter).filter(Boolean);

    const childSequence = child.config.segmentSequence;
    const sequenceLength = childSequence.length;

    const items: string[] = [];

    for (let cursor = 0; cursor < rawSegments.length; ) {
      const nextCursor = cursor + sequenceLength;
      if (nextCursor > rawSegments.length) break;

      let matches = true;
      for (const [index, tag] of childSequence.entries()) {
        const actualSegment = rawSegments[cursor + index];
        if (!actualSegment.startsWith(`${tag}${elementDelimiter}`)) {
          matches = false;
          break;
        }
      }

      if (!matches) break;

      const rawChunk = rawSegments.slice(cursor, nextCursor).join(segmentDelimiter);
      const chunk = `${rawChunk}${segmentDelimiter}`;
      items.push(chunk);

      cursor = nextCursor;
    }

    return items;
  }

  private normalizeX12(x12: string): string {
    return x12.replaceAll('\r', '').replaceAll('\n', '').trim();
  }
}
