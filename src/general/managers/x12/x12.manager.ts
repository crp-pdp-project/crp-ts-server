// export type Location = {
//   tag: string;
//   element: number;
//   component?: number;
//   occurrence?: number;
// };

// export type FieldMap<T> = {
//   [K in keyof T]: Location[];
// };

// export type Segment = string[];

// export type SegmentStore = Record<string, Segment[]>;

// export abstract class X12ManagerConfig<T = Record<string, unknown>> {
//   abstract readonly transactionCode: string;
//   abstract readonly segmentDelimiter: string;
//   abstract readonly elementDelimiter: string;
//   abstract readonly subElementDelimiter: string;
//   abstract readonly segmentConfig: Record<string, number>;
//   abstract readonly fieldMap: FieldMap<T>;
// }

// export interface IX12Manager<Input, Output> {
//   encode(payload: Input): string;
//   decode(x12: string): Output;
// }

// type InferType<Config> = Config extends X12ManagerConfig<infer Type> ? Type : never;

// export class X12Manager<EncodeConf extends X12ManagerConfig, DecodeConf extends X12ManagerConfig>
//   implements IX12Manager<InferType<EncodeConf>, InferType<DecodeConf>>
// {
//   private readonly encodeConfig: EncodeConf;
//   private readonly decodeConfig: DecodeConf;
//   private readonly envelopFields: string[] = ['ISA', 'GS', 'ST', 'SE', 'GE', 'IEA'];

//   constructor(encodeConfig: EncodeConf, decodeConfig?: DecodeConf) {
//     this.encodeConfig = encodeConfig;
//     this.decodeConfig = (decodeConfig ?? encodeConfig) as DecodeConf;
//   }

//   encode(payload: InferType<EncodeConf>): string {
//     const fieldMap = this.extractFields(payload);
//     const segments = this.generateSeed(fieldMap);

//     Object.entries(payload).forEach(([key, value]) => {
//       fieldMap[key].forEach((field) => {
//         this.insertToSegment(String(value ?? ''), field, segments);
//       });
//     });

//     return this.fromSegments(segments);
//   }

//   decode(x12: string): InferType<DecodeConf> {
//     const normalized = this.normalizeX12(x12);
//     const segments = this.toSegments(normalized);

//     return {} as InferType<DecodeConf>;
//   }

//   private makeSegmentElements(tag: string): string[] {
//     const length = this.encodeConfig.segmentConfig[tag];
//     return new Array<string>(length).fill('');
//   }

//   private ensureOccurrence(segmentStore: SegmentStore, tag: string, occurrence: number): string[] {
//     const occurrences = (segmentStore[tag] ??= []);
//     while (occurrences.length < occurrence) {
//       occurrences.push(this.makeSegmentElements(tag));
//     }
//     return occurrences[occurrence - 1];
//   }

//   private buildSeedStore(fieldMap: FieldMap<InferType<EncodeConf>>): SegmentStore {
//     const segmentStore: Record<string, string[][]> = {};

//     for (const tag of this.envelopeTags) {
//       this.ensureOccurrence(segmentStore, tag, 1);
//     }

//     // Ensure enough occurrences for every referenced tag in the field map
//     for (const locations of Object.values(fieldMap)) {
//       for (const location of locations) {
//         const occurrence = location.occurrence ?? 1;
//         this.ensureOccurrence(segmentStore, location.tag, occurrence);
//       }
//     }

//     return segmentStore;
//   }

//   private makeSegment(tag: string): Segment {
//     const length = this.encodeConfig.segmentConfig[tag];
//     const segment = [tag, ...new Array<string>(length).fill('')];
//     return segment;
//   }

//   private generateSeed(fieldMap: FieldMap<InferType<EncodeConf>>): Segment[] {
//     const fieldList: Location[] = Object.values(fieldMap).flat();
//     const order: string[] = Object.keys(this.encodeConfig.segmentConfig);
//     const segmentStructure: Record<string, Segment[]> = Object.fromEntries(
//       this.envelopFields.map((field) => [field, [this.makeSegment(field)]]),
//     );

//     fieldList.forEach((field) => {
//       segmentStructure[field.tag] ??= [];
//       const occurrence = field.occurrence ?? 1;
//       while (segmentStructure[field.tag].length < occurrence) {
//         segmentStructure[field.tag].push(this.makeSegment(field.tag));
//       }
//     });

//     return order.flatMap((tag) => segmentStructure[tag] ?? []);
//   }

//   private insertToSegment(value: string, field: Location, segments: Segment[]): void {
//     const targetOccurrence = field.occurrence ?? 1;
//     let seen = 0;

//     for (const [i, segment] of segments.entries()) {
//       const currentTag = segment[0];
//       if (currentTag !== field.tag) continue;
//       seen += 1;
//       if (seen !== targetOccurrence) continue;

//       if (field.component && field.component > 0) {
//         const parts = segment[field.element].split(this.encodeConfig.subElementDelimiter);
//         while (parts.length < field.component) {
//           parts.push('');
//         }

//         parts[field.component - 1] = value;
//         segments[i][field.element] = parts.join(this.encodeConfig.subElementDelimiter);
//         break;
//       }

//       segments[i][field.element] = value;
//       break;
//     }
//   }

//   private fromSegments(segments: Segment[]): string {
//     const x12String = segments
//       .map((segment) => segment.join(this.encodeConfig.elementDelimiter))
//       .join(this.encodeConfig.segmentDelimiter);
//     return `${x12String}${this.encodeConfig.segmentDelimiter}`;
//   }

//   private escapeRegExp(element: string): string {
//     return element.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   }

//   private normalizeX12(x12: string): string {
//     return x12
//       .replace(/\r?\n/g, '')
//       .replace(
//         new RegExp(`\\s*${this.escapeRegExp(this.decodeConfig.segmentDelimiter)}\\s*`, 'g'),
//         this.decodeConfig.segmentDelimiter,
//       )
//       .replace(
//         new RegExp(`\\s*${this.escapeRegExp(this.decodeConfig.elementDelimiter)}\\s*`, 'g'),
//         this.decodeConfig.elementDelimiter,
//       )
//       .replace(
//         new RegExp(`\\s*${this.escapeRegExp(this.decodeConfig.subElementDelimiter)}\\s*`, 'g'),
//         this.decodeConfig.subElementDelimiter,
//       )
//       .trim();
//   }

//   private toSegments(x12: string): Segment[] {
//     return x12
//       .split(this.decodeConfig.segmentDelimiter)
//       .filter(Boolean)
//       .map((segment) => {
//         return segment.trim().split(this.decodeConfig.elementDelimiter);
//       });
//   }

//   private indexByTag(segments: Segment[]): Record<string, number[]> {
//     const indexes: Record<string, number[]> = {};
//     segments.forEach((segment, i) => {
//       const tag = segment[0];
//       indexes[tag] ??= [];
//       indexes[tag].push(i);
//     });
//     return indexes;
//   }
// }
