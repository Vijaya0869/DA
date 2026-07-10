import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DataSource,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IDatabase } from '../interfaces/database.interface';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class PostgresService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.dataSource.initialize();
  }

  getRepository<T>(entity: EntityTarget<T>): IDatabase<T> {
    const repository = this.dataSource.getRepository(entity);
    return new (class extends BaseRepository<T> {
      protected applySearch(
        query: SelectQueryBuilder<T>,
        searchKey: string,
      ): void {
        return this.applySearch(query, searchKey);
      }
      protected applyFilters(
        query: SelectQueryBuilder<T>,
        filters: Record<string, any>,
      ): void {
        return this.applyFilters(query, filters);
      }
      constructor(repo: Repository<T>) {
        super(repo);
      }
    })(repository);
  }
}
