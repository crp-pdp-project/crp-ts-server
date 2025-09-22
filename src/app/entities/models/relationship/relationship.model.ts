import { RelationshipDTO } from 'src/app/entities/dtos/service/relationship.dto';
import { BaseModel } from 'src/app/entities/models/base.model';

export class RelationshipModel extends BaseModel {
  readonly id?: number;
  readonly name?: string;
  readonly isDependant?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;

  constructor(relationship: RelationshipDTO) {
    super();

    this.id = relationship?.id;
    this.name = relationship?.name;
    this.isDependant = relationship.isDependant != null ? !!relationship.isDependant : undefined;
    this.createdAt = relationship?.createdAt;
    this.updatedAt = relationship?.updatedAt;
  }
}
