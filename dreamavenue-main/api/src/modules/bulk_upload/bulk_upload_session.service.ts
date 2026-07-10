import { BulkUploadSession } from './entities/bulk_upload_session.entity';
import { BaseRepository } from '../../core/database/base.repository';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class BulkUploadSessionService extends BaseRepository<BulkUploadSession> {
  @InjectRepository(Property) private // Specify the Entity here
  _propertyRepository: Repository<Property>;
  protected applySearch(
    query: SelectQueryBuilder<BulkUploadSession>,
    searchKey: string,
  ): void {
    throw new Error('Method not implemented.');
  }

  protected applyFilters(
    query: SelectQueryBuilder<BulkUploadSession>,
    filters: Record<string, any>,
  ): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(Property) // Specify the Entity here
    repository: Repository<BulkUploadSession>,
    @InjectRepository(Property) // Specify the Entity here
    propertyRepository: Repository<Property>,
  ) {
    super(repository);
    this._propertyRepository = propertyRepository;
  }

  public async triggerUpload(file: BulkUploadSession) {

  }
}
