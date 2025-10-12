import { RelationshipDTO } from 'src/app/entities/dtos/service/relationship.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetRelationshipsRepository {
  execute(): Promise<RelationshipDTO[]>;
}

export class GetRelationshipsRepository implements IGetRelationshipsRepository {
  async execute(): Promise<RelationshipDTO[]> {
    const db = MysqlClient.instance.getDb();
    const result = await db.selectFrom('Relationships').select(['id', 'name', 'isDependant']).execute();
    return result;
  }
}

export class GetRelationshipsRepositoryMock implements IGetRelationshipsRepository {
  async execute(): Promise<RelationshipDTO[]> {
    return Promise.resolve([
      {
        id: 1,
        name: 'Hijo/a menor de edad',
        isDependant: true,
      },
    ]);
  }
}
