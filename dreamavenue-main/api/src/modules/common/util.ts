import { QueryRunner, Table, TableColumn } from 'typeorm';

export function trimEndSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function trimEndChar(value: string, charToRemove: string): string {
  const regex = new RegExp(`${charToRemove}+$`);
  return value.replace(regex, '');
}

export async function foreignKeyExists(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const result = await queryRunner.query(
    `SELECT conname AS constraint_name
     FROM pg_constraint
     WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = $1)
       AND conkey[1] = (
         SELECT attnum FROM pg_attribute
         WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = $1)
           AND attname = $2
     )`,
    [tableName, columnName],
  );

  return result.length > 0;
}

export async function colExists(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const table = await queryRunner.getTable(tableName);
  return !!table.findColumnByName(columnName);
}

export async function createTableIfNotExists(
  queryRunner: QueryRunner,
  tableName: string,
): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    }),
    true,
  );
}

export async function createColIfNotExists(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
  columnType: string,
  isNullable: boolean = true,
) {
  if (!(await colExists(queryRunner, tableName, columnName))) {
    await queryRunner.addColumn(
      tableName,
      new TableColumn({
        name: columnName,
        type: columnType,
        isNullable: isNullable,
      }),
    );
  }
}
