import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { createColIfNotExists } from '../modules/common/util';

export class Migration1744072055000 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (!(await queryRunner.hasTable('financing'))) {
      await queryRunner.createTable(
        new Table({
          name: 'financing',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'loan_label',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'financing_of_type_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'property_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'down_payment',
              type: 'decimal',
              precision: 10,
              scale: 2,
              isNullable: true,
            },
            {
              name: 'rehab_down_payment',
              type: 'decimal',
              precision: 10,
              scale: 2,
              isNullable: true,
            },
            {
              name: 'loan_type_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'interest_rate',
              type: 'decimal',
              precision: 10,
              scale: 2,
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'financing',
        new TableForeignKey({
          columnNames: ['financing_of_type_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'financing_of_type',
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createForeignKey(
        'financing',
        new TableForeignKey({
          columnNames: ['loan_type_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'loan_type',
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createForeignKey(
        'financing',
        new TableForeignKey({
          columnNames: ['property_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'property',
          onDelete: 'SET NULL',
        }),
      );
    }

    await createColIfNotExists(
      queryRunner,
      'financing',
      'down_payment_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'financing',
      'calc_down_payment',
      'decimal',
    );

    await createColIfNotExists(
      queryRunner,
      'closing_costs',
      'period_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'closing_costs',
      'no_of_periods',
      'integer',
    );

    await createColIfNotExists(
      queryRunner,
      'holding_costs',
      'period_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'holding_costs',
      'no_of_periods',
      'integer',
    );

    await createColIfNotExists(
      queryRunner,
      'purchase_costs',
      'period_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'purchase_costs',
      'no_of_periods',
      'integer',
    );

    await createColIfNotExists(
      queryRunner,
      'rehab_costs',
      'period_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'rehab_costs',
      'no_of_periods',
      'integer',
    );

    await createColIfNotExists(
      queryRunner,
      'selling_costs',
      'period_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'selling_costs',
      'no_of_periods',
      'integer',
    );

    await createColIfNotExists(queryRunner, 'property', 'arv', 'decimal');

    if (!(await queryRunner.hasTable('user_tags'))) {
      await queryRunner.createTable(
        new Table({
          name: 'user_tags',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'tags',
              type: 'text',
              isNullable: false,
            },
          ],
        }),
      );
    }

    if (!(await queryRunner.hasTable('prop_query'))) {
      await queryRunner.createTable(
        new Table({
          name: 'prop_query',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'key',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'response',
              type: 'jsonb',
              isNullable: true,
            },
          ],
        }),
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
