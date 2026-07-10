import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class Migration1738597151000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'property_type',
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

    await queryRunner.createTable(
      new Table({
        name: 'document_type',
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

    await queryRunner.createTable(
      new Table({
        name: 'loan_type',
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

    await queryRunner.createTable(
      new Table({
        name: 'state',
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

    await queryRunner.createTable(
      new Table({
        name: 'city',
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
          {
            name: 'state_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'passwordHash',
            type: 'varchar',
            isNullable: true, // Nullable for OAuth users
          },
          {
            name: 'provider',
            type: 'varchar',
            default: "'local'",
          },
          {
            name: 'subscription_tier',
            type: 'varchar',
            default: "'free'",
          },
          {
            name: 'subscription_status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
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
    await queryRunner.createTable(
      new Table({
        name: 'property',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'zip_code',
            type: 'varchar',
          },
          {
            name: 'property_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tags_n_labels',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'zoning',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'mls_number',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'purchase_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'closing_costs',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'after_repair_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'rehab_costs',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'selling_costs',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'holding_costs',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'loan_term',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'bedrooms',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'parking',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'bathrooms',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'year_built',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'listing_price',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'estimated_arv',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'estimated_rent',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'square_feet',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'lot_size',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'property_type_id',
            type: 'uuid',
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
    await queryRunner.createTable(
      new Table({
        name: 'property_analysis',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'cap_rate',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'roi',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'cash_flow',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'recommended_strategy',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'neighborhood_score',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'analysis_date',
            type: 'timestamp',
            default: 'now()',
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
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'marketing_campaign',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'draft'",
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'budget',
            type: 'decimal',
            isNullable: true,
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
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'campaign_property',
        columns: [
          {
            name: 'campaign_id',
            type: 'uuid',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'purchase_costs',
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

    await queryRunner.createTable(
      new Table({
        name: 'selling_costs',
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

    await queryRunner.createTable(
      new Table({
        name: 'rehab_costs',
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

    await queryRunner.createTable(
      new Table({
        name: 'holding_costs',
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

    // Fractional Investments Table
    await queryRunner.createTable(
      new Table({
        name: 'fractional_investment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'total_shares',
            type: 'int',
          },
          {
            name: 'available_shares',
            type: 'int',
          },
          {
            name: 'price_per_share',
            type: 'decimal',
          },
          {
            name: 'minimum_shares',
            type: 'int',
            default: 1,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
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
        ],
      }),
    );

    // User Investments Table
    await queryRunner.createTable(
      new Table({
        name: 'user_investment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'fractional_investment_id',
            type: 'uuid',
          },
          {
            name: 'shares_owned',
            type: 'int',
          },
          {
            name: 'purchase_price',
            type: 'decimal',
          },
          {
            name: 'purchase_date',
            type: 'timestamp',
            default: 'now()',
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
        ],
      }),
    );

    // Documents Table
    await queryRunner.createTable(
      new Table({
        name: 'document',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
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
        ],
      }),
    );

    // Documents Table
    await queryRunner.createTable(
      new Table({
        name: 'image',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
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
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'bulk_upload_session',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'", // pending, processing, completed, failed
          },
          {
            name: 'file_name',
            type: 'varchar',
          },
          {
            name: 'file_url',
            type: 'varchar',
          },
          {
            name: 'total_records',
            type: 'int',
            default: 0,
          },
          {
            name: 'processed_records',
            type: 'int',
            default: 0,
          },
          {
            name: 'failed_records',
            type: 'int',
            default: 0,
          },
          {
            name: 'upload_type',
            type: 'varchar', // csv, excel, api, manual
          },
          {
            name: 'error_log',
            type: 'jsonb',
            isNullable: true,
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
        ],
      }),
    );

    // Bulk Upload Records Table
    await queryRunner.createTable(
      new Table({
        name: 'bulk_upload_record',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'session_id',
            type: 'uuid',
          },
          {
            name: 'property_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'raw_data',
            type: 'jsonb',
          },
          {
            name: 'status',
            type: 'varchar', // pending, processed, failed
          },
          {
            name: 'error_message',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'row_number',
            type: 'int',
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
        ],
      }),
    );

    // AI Analysis Queue Table
    await queryRunner.createTable(
      new Table({
        name: 'ai_analysis_queue',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'session_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar', // pending, processing, completed, failed
          },
          {
            name: 'priority',
            type: 'int',
            default: 0,
          },
          {
            name: 'retry_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'error_message',
            type: 'varchar',
            isNullable: true,
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
        ],
      }),
    );

    // AI Analysis Results Table
    await queryRunner.createTable(
      new Table({
        name: 'ai_analysis_result',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'analysis_type',
            type: 'varchar', // market_analysis, investment_strategy, risk_assessment, etc.
          },
          {
            name: 'raw_results',
            type: 'jsonb',
          },
          {
            name: 'confidence_score',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'model_version',
            type: 'varchar',
          },
          {
            name: 'processing_time',
            type: 'int', // in milliseconds
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
        ],
      }),
    );

    // User Analysis Preferences Table
    await queryRunner.createTable(
      new Table({
        name: 'user_analysis_preference',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'preferred_metrics',
            type: 'jsonb', // Array of metrics to analyze
          },
          {
            name: 'investment_criteria',
            type: 'jsonb', // Min/max values for various metrics
          },
          {
            name: 'market_preferences',
            type: 'jsonb', // Preferred locations, property types
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
        ],
      }),
    );

    // Create Foreign Keys
    await queryRunner.createForeignKey(
      'bulk_upload_session',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bulk_upload_record',
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bulk_upload_session',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bulk_upload_record',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'ai_analysis_queue',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'ai_analysis_queue',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'ai_analysis_queue',
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bulk_upload_session',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'ai_analysis_result',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'ai_analysis_result',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'user_analysis_preference',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    // Create Indexes
    await queryRunner.createIndex(
      'bulk_upload_session',
      new TableIndex({
        name: 'IDX_bulk_upload_sessions_status',
        columnNames: ['status', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'bulk_upload_record',
      new TableIndex({
        name: 'IDX_bulk_upload_records_session',
        columnNames: ['session_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'ai_analysis_queue',
      new TableIndex({
        name: 'IDX_ai_analysis_queue_status',
        columnNames: ['status', 'priority', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'ai_analysis_result',
      new TableIndex({
        name: 'IDX_ai_analysis_results_property',
        columnNames: ['property_id', 'analysis_type'],
      }),
    );

    // Create Foreign Keys
    await queryRunner.createForeignKey(
      'property_analysis',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'property_analysis',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'marketing_campaign',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'campaign_property',
      new TableForeignKey({
        columnNames: ['campaign_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'marketing_campaign',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'campaign_property',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'fractional_investment',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'user_investment',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'user_investment',
      new TableForeignKey({
        columnNames: ['fractional_investment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fractional_investment',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'document',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'document',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'city',
      new TableForeignKey({
        columnNames: ['state_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'state',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'property',
      new TableForeignKey({
        columnNames: ['property_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property_type',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'property',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'rehab_costs',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'selling_costs',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'purchase_costs',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'holding_costs',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'property',
        onDelete: 'SET NULL',
      }),
    );

    // Create Indexes
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'property',
      new TableIndex({
        name: 'IDX_properties_address',
        columnNames: ['address', 'city', 'state', 'zip_code'],
      }),
    );

    await queryRunner.createIndex(
      'property_analysis',
      new TableIndex({
        name: 'IDX_property_analysis_date',
        columnNames: ['analysis_date'],
      }),
    );

    await queryRunner.createIndex(
      'marketing_campaign',
      new TableIndex({
        name: 'IDX_marketing_campaigns_status',
        columnNames: ['status', 'start_date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_analysis_preference');
    await queryRunner.dropTable('ai_analysis_result');
    await queryRunner.dropTable('ai_analysis_queue');
    await queryRunner.dropTable('bulk_upload_record');
    await queryRunner.dropTable('bulk_upload_session');
    await queryRunner.dropTable('document');
    await queryRunner.dropTable('user_investment');
    await queryRunner.dropTable('fractional_investment');
    await queryRunner.dropTable('campaign_property');
    await queryRunner.dropTable('marketing_campaign');
    await queryRunner.dropTable('property_analysis');
    await queryRunner.dropTable('property');
    await queryRunner.dropTable('user');
  }
}
