import { SearchCriteria } from '../database/search.criteria';
import { DeepPartial } from "typeorm";

export interface IDatabase<T> {
  findOne(id: string): Promise<T>;
  findMany(criteria: SearchCriteria): Promise<[T[], number]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  updateMany(criteria: SearchCriteria, data: Partial<T>): Promise<number>;
  deleteMany(criteria: SearchCriteria): Promise<number>;
}
