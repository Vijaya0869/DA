import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm";
import { IDatabase } from '../interfaces/database.interface';
import { SearchCriteria } from './search.criteria';

export abstract class BaseRepository<T> implements IDatabase<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findOne(id: string): Promise<T> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findMany(criteria: SearchCriteria): Promise<[T[], number]> {
    const query = this.repository.createQueryBuilder('entity');

    // Apply search
    if (criteria.searchKey) {
      this.applySearch(query, criteria.searchKey);
    }

    // Apply filters
    if (criteria.filters) {
      this.applyFilters(query, criteria.filters);
    }

    // Apply relations
    if (criteria.relations) {
      criteria.relations.forEach((relation) => {
        query.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    // Apply select fields
    if (criteria.select) {
      query.select(criteria.select.map((field) => `entity.${field}`));
    }

    // Apply pagination
    query
      .skip((criteria.pageNumber - 1) * criteria.pageSize)
      .take(criteria.pageSize);

    // Apply ordering
    if (criteria.orderBy) {
      Object.entries(criteria.orderBy).forEach(([key, order]) => {
        query.addOrderBy(`entity.${key}`, order);
      });
    }

    return query.getManyAndCount();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data as any[]);
    return this.repository.save(entities);
  }

  async updateMany(
    criteria: SearchCriteria,
    data: Partial<T>,
  ): Promise<number> {
    const query = this.repository.createQueryBuilder('entity');

    if (criteria.filters) {
      this.applyFilters(query, criteria.filters);
    }

    const result = await query
      .update()
      .set(data as any)
      .execute();

    return result.affected || 0;
  }

  async deleteMany(criteria: SearchCriteria): Promise<number> {
    const query = this.repository.createQueryBuilder('entity');

    if (criteria.filters) {
      this.applyFilters(query, criteria.filters);
    }

    const result = await query.delete().execute();

    return result.affected || 0;
  }

  protected abstract applySearch(
    query: SelectQueryBuilder<T>,
    searchKey: string,
  ): void;
  protected abstract applyFilters(
    query: SelectQueryBuilder<T>,
    filters: Record<string, any>,
  ): void;
}
