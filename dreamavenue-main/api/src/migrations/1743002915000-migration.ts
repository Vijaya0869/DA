import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { createColIfNotExists } from '../modules/common/util';

export class Migration1743002915000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createColIfNotExists(
      queryRunner,
      'closing_costs',
      'calculated_amount',
      'decimal',
      true,
    );
    await createColIfNotExists(
      queryRunner,
      'rehab_costs',
      'calculated_amount',
      'decimal',
      true,
    );
    await createColIfNotExists(
      queryRunner,
      'selling_costs',
      'calculated_amount',
      'decimal',
      true,
    );
    await createColIfNotExists(
      queryRunner,
      'holding_costs',
      'calculated_amount',
      'decimal',
      true,
    );
    await createColIfNotExists(
      queryRunner,
      'purchase_costs',
      'calculated_amount',
      'decimal',
      true,
    );

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
      'loan_term',
      'integer',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'closing_costs_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'rehab_costs_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'selling_costs_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'purchase_costs_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'holding_costs_type',
      'varchar',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'clear_rehab_itemize_costs',
      'boolean',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'clear_selling_itemize_costs',
      'boolean',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'clear_holding_itemize_costs',
      'boolean',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'clear_purchase_itemize_costs',
      'boolean',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'clear_closing_itemize_costs',
      'boolean',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'calc_closing_costs',
      'decimal',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'calc_purchase_costs',
      'decimal',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'calc_rehab_costs',
      'decimal',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'calc_selling_costs',
      'decimal',
    );

    await createColIfNotExists(
      queryRunner,
      'property',
      'calc_holding_costs',
      'decimal',
    );

    await createColIfNotExists(queryRunner, 'financing', 'amount', 'decimal');
    await createColIfNotExists(
      queryRunner,
      'rehab_costs',
      'cost_type',
      'varchar',
    );
    await createColIfNotExists(
      queryRunner,
      'financing',
      'calc_amount',
      'decimal',
    );
    await createColIfNotExists(
      queryRunner,
      'financing',
      'amount_type',
      'varchar',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
