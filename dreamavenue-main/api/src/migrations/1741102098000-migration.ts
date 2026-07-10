import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { colExists, foreignKeyExists } from '../modules/common/util';

export class Migration1741102098000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('property'); // Get table details
    const user_table = await queryRunner.getTable('user'); // Get table details

    // Check if column exists
    if (!table?.findColumnByName('purchase_costs')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'purchase_costs',
          type: 'decimal',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('investment_strategy_id')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'investment_strategy_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('rehab_cost_overrun')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'rehab_cost_overrun',
          type: 'decimal',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('is_favorite')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'is_favorite',
          type: 'boolean',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('rehab_cost_holding_period')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'rehab_cost_holding_period',
          type: 'integer',
          isNullable: true,
        }),
      );
    }

    if (!(await colExists(queryRunner, 'selling_costs', 'amount_type'))) {
      await queryRunner.addColumn(
        'selling_costs',
        new TableColumn({
          name: 'amount_type',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await colExists(queryRunner, 'purchase_costs', 'amount_type'))) {
      await queryRunner.addColumn(
        'purchase_costs',
        new TableColumn({
          name: 'amount_type',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await colExists(queryRunner, 'holding_costs', 'amount_type'))) {
      await queryRunner.addColumn(
        'holding_costs',
        new TableColumn({
          name: 'amount_type',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await colExists(queryRunner, 'rehab_costs', 'amount_type'))) {
      await queryRunner.addColumn(
        'rehab_costs',
        new TableColumn({
          name: 'amount_type',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('lot_size_type')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'lot_size_type',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('geocode')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'geocode',
          type: 'geography(Point, 4326)', // Uses WGS84 coordinate system
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('geocode_response')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'geocode_response',
          type: 'jsonb', // Uses WGS84 coordinate system
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('full_address')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'full_address',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('property_unique_id')) {
      await queryRunner.addColumn(
        'property',
        new TableColumn({
          name: 'property_unique_id',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!user_table?.findColumnByName('verification_key')) {
      await queryRunner.addColumn(
        'user',
        new TableColumn({
          name: 'verification_key',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await foreignKeyExists(queryRunner, 'city', 'state_id'))) {
      await queryRunner.createForeignKey(
        'city',
        new TableForeignKey({
          columnNames: ['state_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'state',
          onDelete: 'SET NULL',
        }),
      );
    }

    if (!(await queryRunner.hasTable('closing_costs'))) {
      await queryRunner.createTable(
        new Table({
          name: 'closing_costs',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'amount',
              type: 'decimal',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'property_id',
              type: 'uuid',
            },
          ],
        }),
      );

      if (!(await colExists(queryRunner, 'closing_costs', 'amount_type'))) {
        await queryRunner.addColumn(
          'closing_costs',
          new TableColumn({
            name: 'amount_type',
            type: 'varchar',
            isNullable: true,
          }),
        );
      }

      await queryRunner.createForeignKey(
        'closing_costs',
        new TableForeignKey({
          columnNames: ['property_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'property',
          onDelete: 'SET NULL',
        }),
      );
    }

    if (!(await queryRunner.hasTable('investment_strategy'))) {
      await queryRunner.createTable(
        new Table({
          name: 'investment_strategy',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'code',
              type: 'varchar',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'property',
        new TableForeignKey({
          columnNames: ['investment_strategy_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'investment_strategy',
          onDelete: 'SET NULL',
        }),
      );
    }

    if (!(await queryRunner.hasTable('financing_of_type'))) {
      await queryRunner.createTable(
        new Table({
          name: 'financing_of_type',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'code',
              type: 'varchar',
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (table?.findColumnByName('purchase_costs')) {
      await queryRunner.dropColumn('property', 'property');
    }
  }
}
