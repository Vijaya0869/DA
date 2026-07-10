import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as process from 'node:process';
import { UtilService } from '../common/util-service'; // Importing the addresser package

@Injectable()
export class MasterService {
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly utilService: UtilService,
  ) {}

  private async getCachedData<T>(
    key: string,
    query: string,
    params: any[] = [],
  ): Promise<T> {
    // Check if the data exists in cache
    let data = await this.cacheManager.get<T>(key);
    if (!data) {
      // If not in cache, fetch from DB
      data = await this.dataSource.query(query, params);
      // Store in cache with a TTL of 10 minutes
      await this.cacheManager.set(key, data, 600000);
    }
    return data;
  }

  async getAllPropertyTypes() {
    return this.getCachedData(
      'property_types',
      'SELECT id, name, code FROM property_type',
    );
  }

  async getAllLoanTypes() {
    return this.getCachedData(
      'loan_types',
      'SELECT id, name, code FROM loan_type',
    );
  }

  async getCities(state_id: string | undefined) {
    if (!state_id) {
      return this.getCachedData(
        `cities_all`,
        'SELECT id, name, code FROM city',
      );
    }
    return this.getCachedData(
      `cities_${state_id}`,
      'SELECT id, name, code FROM city WHERE state_id = $1',
      [state_id],
    );
  }

  async getStates() {
    return this.getCachedData('states', 'SELECT id, name, code FROM state');
  }

  async getInvestmentStrategies() {
    return this.getCachedData(
      'investment_strategies',
      'SELECT id, name, code FROM investment_strategy',
    );
  }

  async getFinancingOfTypes() {
    return this.getCachedData(
      'financing_of_types',
      'SELECT id, name, code FROM financing_of_type',
    );
  }

  async suggestAddress(query: string) {
    const url = new URL(
      'https://autosuggest.search.hereapi.com/v1/autosuggest',
    );

    url.searchParams.append('lang', 'en');
    url.searchParams.append('q', query);
    url.searchParams.append('apiKey', process.env.HERE_API_KEY);
    url.searchParams.append(
      'in',
      'bbox:-124.848974,24.396308,-66.885444,49.384358',
    );
    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return await this.parseAddresses(data);
  }

  async parseAddresses(jsonData) {
    const addresses = [];
    if (jsonData.items && Array.isArray(jsonData.items)) {
      for (const item of jsonData.items) {
        if (item.address && item.address.label) {
          addresses.push(await this.utilService.parse(item.address.label));
        }
      }
    }
    return addresses;
  }
}
