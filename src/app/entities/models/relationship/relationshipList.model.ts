import { RelationshipDTO } from '../../dtos/service/relationship.dto';
import { BaseModel } from '../base.model';

import { RelationshipModel } from './relationship.model';

export class RelationshipListModel extends BaseModel {
  readonly relationships: RelationshipModel[];

  constructor(relationshipList: RelationshipDTO[]) {
    super();

    this.relationships = this.generateRelationshipList(relationshipList);
  }

  private generateRelationshipList(relationshipList: RelationshipDTO[]): RelationshipModel[] {
    return relationshipList.map((relationship) => new RelationshipModel(relationship));
  }
}
