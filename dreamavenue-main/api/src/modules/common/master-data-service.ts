import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'node:process';

@Injectable()
export class MasterDataService implements OnModuleInit {
  private readonly config = [
    { table: 'state', file: '../../../data/states.json', uniqueKey: 'id' },
    { table: 'city', file: '../../../data/cities.json', uniqueKey: 'id' },
    {
      table: 'investment_strategy',
      file: '../../../data/investment_strategies.json',
      uniqueKey: 'id',
    },
    {
      table: 'financing_of_type',
      file: '../../../data/financing_of_types.json',
      uniqueKey: 'id',
    },
    {
      table: 'property_type',
      file: '../../../data/property_types.json',
      uniqueKey: 'id',
    },
    {
      table: 'loan_type',
      file: '../../../data/loan_types.json',
      uniqueKey: 'id',
    },
  ]; // Add more tables as needed

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    console.log(`🔄 Syncing master data...`);
    if (process.env.LOAD_DATA) {
      for (const { table, file, uniqueKey } of this.config) {
        await this.syncTable(table, file, uniqueKey);
      }
    }
    console.log(`✅ Master data sync completed.`);
  }

  async syncTable(tableName: string, fileName: string, uniqueKey: string) {
    try {
      const filePath = path.join(__dirname, '..', 'data', fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        return;
      }

      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.warn(`⚠️ No data found in ${filePath}`);
        return;
      }

      const existingData = await this.dataSource.query(
        `SELECT * FROM ${tableName}`,
      );
      const existingMap = new Map(
        existingData.map((item) => [item[uniqueKey], item]),
      );

      const toInsert = [];
      const toUpdate = [];
      const batchSize = 1000; // Process in batches of 1000 records

      for (const item of jsonData) {
        const key = item[uniqueKey];

        if (existingMap.has(key)) {
          // Check if update is required
          const existingItem = existingMap.get(key);
          const needsUpdate = Object.keys(item).some(
            (field) => item[field] !== existingItem[field],
          );

          if (needsUpdate) {
            toUpdate.push(item);
          }
        } else {
          toInsert.push(item);
        }
      }

      // 🚀 Bulk Insert with Batching
      if (toInsert.length > 0) {
        const fields = Object.keys(toInsert[0]);
        for (let i = 0; i < toInsert.length; i += batchSize) {
          const batch = toInsert.slice(i, i + batchSize);
          const placeholders = batch
            .map(
              (_, batchIndex) =>
                `(${fields.map((_, fieldIndex) => `$${batchIndex * fields.length + fieldIndex + 1}`).join(', ')})`,
            )
            .join(', ');
          const queryValues = batch.flatMap((item) => Object.values(item));

          const insertQuery = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES ${placeholders}`;

          await this.dataSource.query(insertQuery, queryValues);
          console.log(`➕ Inserted ${batch.length} records into ${tableName}`);
        }
      }

      // 🚀 Bulk Update with Batching
      if (toUpdate.length > 0) {
        for (const item of toUpdate) {
          const fields = Object.keys(item);
          const setClause = fields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(', ');
          const values = [...Object.values(item), item[uniqueKey]];

          await this.dataSource.query(
            `UPDATE ${tableName} SET ${setClause} WHERE ${uniqueKey} = $${values.length}`,
            values,
          );
        }
        console.log(`📝 Updated ${toUpdate.length} records in ${tableName}`);
      }

      // 🚀 Bulk Delete Optimization
      const jsonKeys = new Set(jsonData.map((item) => item[uniqueKey]));
      const toDelete = existingData.filter(
        (item) => !jsonKeys.has(item[uniqueKey]),
      );

      if (toDelete.length > 0) {
        for (let i = 0; i < toDelete.length; i += batchSize) {
          const batch = toDelete.slice(i, i + batchSize);
          const deleteQuery = `DELETE FROM ${tableName} WHERE ${uniqueKey} = ANY($1)`;
          await this.dataSource.query(deleteQuery, [
            batch.map((item) => item[uniqueKey]),
          ]);
          console.log(`❌ Deleted ${batch.length} records from ${tableName}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error syncing table ${tableName}:`, error);
    }
  }
}
