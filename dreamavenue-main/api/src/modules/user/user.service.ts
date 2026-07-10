import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/database/base.repository';
import { User } from './entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTags } from './entities/user_tags.entity';
import { UserReportSettings } from './entities/user_report_settings.entity';
import { UpdateUserReportSettingsDto } from './dto/update-user-report-settings.dto';
import { GetUserReportSettings } from './dto/get-user-report-settings.dto';

@Injectable()
export class UserService extends BaseRepository<User> {
  defaultPropertyReportSettings = {
    'ROI Calculation and Recommendation': 'roi-calculation-and-recommendation',
    'Financial Summary': 'financial-summary',
    'Rental AVM Data': 'rental-avm-data',
    'Sales History': 'sales-history',
    'Historical AVM Values': 'historical-avm-values',
    'Percent Change in AVM Value Over Time':
      'percent-change-in-avm-value-over-time',
    'Property Appreciation': 'property-appreciation',
    'Mortgage History': 'mortgage-history',
    'Assessment Data': 'assessment-data',
    'Comparative Market Analysis (CMA)': 'comparative-market-analysis-cma',
    'Purchase & Rehab': 'purchase-and-rehab',
    Financing: 'financing',
    Valuation: 'valuation',
    '1st Year Return': '1st-year-return',
    'Purchase Financial Ratio': 'purchase-financial-ratio',
  };
  constructor(
    @InjectRepository(User) // Specify the Entity here
    repository: Repository<User>,
    private dataSource: DataSource,
  ) {
    super(repository);
  }
  private static readonly FILTERABLE_COLUMNS = new Set([
    'email',
    'firstName',
    'lastName',
    'provider',
    'is_verified',
  ]);

  protected applySearch(
    query: SelectQueryBuilder<User>,
    searchKey: string,
  ): void {
    if (searchKey) {
      query.andWhere(
        '(entity.email ILIKE :searchKeyStr OR entity."firstName" ILIKE :searchKeyStr OR entity."lastName" ILIKE :searchKeyStr)',
        { searchKeyStr: `%${searchKey}%` },
      );
    }
  }
  protected applyFilters(
    query: SelectQueryBuilder<User>,
    filters: Record<string, any>,
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      if (!UserService.FILTERABLE_COLUMNS.has(key)) {
        return;
      }
      if (value === undefined || value === null) {
        return;
      }
      const paramKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
      const column = `entity."${key}"`;
      if (Array.isArray(value)) {
        query.andWhere(`${column} IN (:...${paramKey})`, { [paramKey]: value });
      } else if (typeof value === 'string' && value.includes('%')) {
        query.andWhere(`${column} ILIKE :${paramKey}`, { [paramKey]: value });
      } else {
        query.andWhere(`${column} = :${paramKey}`, { [paramKey]: value });
      }
    });
  }

  public async getUserTags(userId: string): Promise<string[]> {
    const userTags = await this.dataSource.getRepository(UserTags).findOne({
      where: { userId: userId },
    });
    if (userTags && userTags.tags) {
      return userTags.tags.split(',').map(function (item) {
        return item.trim();
      });
    } else {
      return [];
    }
  }

  public async getUserReportSettings(
    dto: GetUserReportSettings,
  ): Promise<UserReportSettings[]> {
    const response = [];
    const userSettingsRepository =
      this.dataSource.getRepository(UserReportSettings);
    const userReportSettings = await userSettingsRepository.find({
      where: {
        report_name: dto.report_name,
      },
    });
    const keys = Object.keys(this.defaultPropertyReportSettings);
    for (const key of keys) {
      const settings = userReportSettings.find((s) => s.section_name === key);
      if (settings) {
        response.push(settings);
      } else {
        const newSettings = new UserReportSettings();
        newSettings.section_name = key;
        newSettings.report_name = dto.report_name;
        newSettings.selected = true;
        newSettings.user_id = dto.user_id;
        userSettingsRepository.create(newSettings);
        response.push(await userSettingsRepository.save(newSettings));
      }
    }
    return response;
  }

  public async updateUserSettings(dto: UpdateUserReportSettingsDto) {
    const userSettingsRepository =
      this.dataSource.getRepository(UserReportSettings);

    await userSettingsRepository.update(
      {
        user_id: dto.user_id,
        report_name: dto.report_name,
        section_name: dto.section_name,
      },
      dto,
    );
  }
}
