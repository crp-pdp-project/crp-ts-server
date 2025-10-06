import {
  sql,
  ExpressionWrapper,
  RawBuilder,
  ReferenceNode,
  ColumnNode,
  AliasedRawBuilder,
  isAliasedExpression,
  IdentifierNode,
} from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

type AnyExpression = ExpressionWrapper<Database, never, unknown> | AliasedRawBuilder<unknown, string>;

type JsonArrayOptions = {
  checkNull?: AnyExpression;
};

export class SqlJSONHelper {
  static jsonArrayObject(refs: AnyExpression[], options?: JsonArrayOptions): RawBuilder<unknown> {
    const fieldPairs = this.generateFieldPairs(refs);
    const joinedFields = sql.join(fieldPairs, sql`, `);
    const jsonObject = sql`JSON_OBJECT(${joinedFields})`;

    const arrayResult = options?.checkNull
      ? sql`JSON_ARRAYAGG(IF(${options.checkNull} IS NOT NULL, ${jsonObject}, NULL))`
      : sql`JSON_ARRAYAGG(${jsonObject})`;

    return arrayResult;
  }

  static jsonObject(refs: AnyExpression[], options?: JsonArrayOptions): RawBuilder<unknown> {
    const fieldPairs = this.generateFieldPairs(refs);
    const joinedFields = sql.join(fieldPairs, sql`, `);
    const jsonObject = sql`JSON_OBJECT(${joinedFields})`;

    const jsonResult = options?.checkNull ? sql`IF(${options.checkNull} IS NOT NULL, ${jsonObject}, NULL)` : jsonObject;

    return jsonResult;
  }

  private static generateFieldPairs(refs: AnyExpression[]): RawBuilder<unknown>[] {
    return refs.map((attribute) => {
      const { col, ref } = this.inferFieldName(attribute);
      return sql`${col}, ${ref}`;
    });
  }

  private static inferFieldName(ref: AnyExpression): { col: RawBuilder<unknown>; ref: RawBuilder<unknown> } {
    if (isAliasedExpression(ref)) {
      const newRef = sql`${ref.expression}`;
      const node = ref.toOperationNode().alias as IdentifierNode;
      return { col: sql.raw(`'${node.name}'`), ref: newRef };
    }

    const newRef = sql`${ref}`;
    const node = ref.toOperationNode() as ReferenceNode;
    const { column } = node.column as ColumnNode;
    return { col: sql.raw(`'${column.name}'`), ref: newRef };
  }
}
