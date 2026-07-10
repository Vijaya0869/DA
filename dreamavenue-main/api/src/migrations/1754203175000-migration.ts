import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import {
  createColIfNotExists,
  createTableIfNotExists,
} from '../modules/common/util';

export class Migration1754203175000 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<any> {
    await createTableIfNotExists(queryRunner, 'user_report_settings');
    await createColIfNotExists(
      queryRunner,
      'user_report_settings',
      'user_id',
      'uuid',
      false,
    );
    await createColIfNotExists(
      queryRunner,
      'user_report_settings',
      'report_name',
      'text',
      false,
    );
    await createColIfNotExists(
      queryRunner,
      'user_report_settings',
      'section_name',
      'text',
      false,
    );
    await createColIfNotExists(
      queryRunner,
      'user_report_settings',
      'selected',
      'boolean',
      false,
    );
    await queryRunner.createForeignKey(
      'user_report_settings',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
