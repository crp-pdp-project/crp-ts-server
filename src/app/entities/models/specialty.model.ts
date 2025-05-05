import { TextHelper } from 'src/general/helpers/text.helper';

import { SpecialtyDTO } from '../dtos/service/specialty.dto';

import { BaseModel } from './base.model';

export class SpecialtyModel extends BaseModel {
  readonly id?: string;
  readonly groupId?: string | null;
  readonly name?: string;

  constructor(specialty: SpecialtyDTO, groupMeta?: SpecialtyDTO[]) {
    super();

    this.id = specialty.id;
    this.name = TextHelper.titleCase(specialty.name);
    this.groupId = specialty.groupId ?? (groupMeta ? this.resolveGroupId(specialty.id, groupMeta) : undefined);
  }

  private resolveGroupId(id?: SpecialtyDTO['id'], groupMeta?: SpecialtyDTO[]): string | null {
    return groupMeta?.find((meta) => meta.id === id)?.groupId ?? null;
  }
}
