import { RelationshipListModel } from 'src/app/entities/models/relationship/relationshipList.model';
import {
  GetRelationshipsRepository,
  IGetRelationshipsRepository,
} from 'src/app/repositories/database/getRelationships.repository';

export interface IRelationshipsListInteractor {
  list(): Promise<RelationshipListModel>;
}

export class RelationshipsListInteractor implements IRelationshipsListInteractor {
  constructor(private readonly getRelationshipts: IGetRelationshipsRepository) {}

  async list(): Promise<RelationshipListModel> {
    const patientWithRelatives = await this.getRelationshipts.execute();

    return new RelationshipListModel(patientWithRelatives);
  }
}

export class RelationshipsListInteractorBuilder {
  static build(): RelationshipsListInteractor {
    return new RelationshipsListInteractor(new GetRelationshipsRepository());
  }
}
