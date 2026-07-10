import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/database/base.repository';
import { Property } from './entities/property.entity';
import {
  DataSource,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PurchaseCosts } from './entities/purchase-costs.entity';
import { RehabCosts } from './entities/rehab-costs.entity';
import { SellingCosts } from './entities/selling-costs.entity';
import { HoldingCosts } from './entities/holding-costs.entity';
import { CreateCostsDto } from './dto/create-costs.dto';
import { Image } from './entities/image.entity';
import { ClosingCosts } from './entities/closing-costs.entity';
import * as process from 'node:process';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { MasterService } from '../master/master.service';
import { Financing } from './entities/financing.entity';
import { PropertyDetailsDto } from './dto/property-details.dto';
import { CreateRehabCostsDto } from './dto/create-rehab-costs.dto';
import { RentcastService } from '../analysis/rentcast.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UserTags } from '../user/entities/user_tags.entity';
import axios from 'axios';
import { json } from 'express';

@Injectable()
export class PropertyService extends BaseRepository<Property> {
  private _documentRepository: Repository<Document>;
  private _repository: Repository<Property>;
  private purchaseCostsRepository: Repository<PurchaseCosts>;
  private rehabCostsRepository: Repository<RehabCosts>;
  private sellingCostsRepository: Repository<SellingCosts>;
  private holdingCostsRepository: Repository<HoldingCosts>;
  private imageRepository: Repository<Image>;
  private closingCostsRepository: Repository<ClosingCosts>;
  private _financingRepository: Repository<Financing>;
  private propertyRepository: Repository<Property>;

  constructor(
    @InjectRepository(Property) // Specify the Entity here
    repository: Repository<Property>,
    @InjectRepository(Document)
    documentRepository: Repository<Document>,
    @InjectRepository(PurchaseCosts)
    purchaseCostsRepository: Repository<PurchaseCosts>,
    @InjectRepository(RehabCosts)
    rehabCostsRepository: Repository<RehabCosts>,
    @InjectRepository(SellingCosts)
    sellingCostsRepository: Repository<SellingCosts>,
    @InjectRepository(HoldingCosts)
    holdingCostsRepository: Repository<HoldingCosts>,
    @InjectRepository(ClosingCosts)
    closingCostsRepository: Repository<ClosingCosts>,
    @InjectRepository(Image)
    imageRepository: Repository<Image>,
    @InjectRepository(Financing)
    financingRepository: Repository<Financing>,
    @InjectRepository(Property)
    propertyRepository: Repository<Property>,
    private dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly masterService: MasterService,
    private readonly rentCastService: RentcastService,
  ) {
    super(repository);
    this._repository = repository;
    this.imageRepository = imageRepository;
    this.purchaseCostsRepository = purchaseCostsRepository;
    this.rehabCostsRepository = rehabCostsRepository;
    this.sellingCostsRepository = sellingCostsRepository;
    this.holdingCostsRepository = holdingCostsRepository;
    this.closingCostsRepository = closingCostsRepository;
    this._documentRepository = documentRepository;
    this._financingRepository = financingRepository;
    this.propertyRepository = propertyRepository;
  }

  async massageThumbnailImage(properties: Property[]) {
    const firstImages = await this.dataSource.query(
      `
        WITH ranked_images AS (SELECT *,
                                      ROW_NUMBER() OVER (PARTITION BY property_id ORDER BY created_at) AS rn
                               FROM image
                               WHERE property_id = ANY ($1))
        SELECT *
        FROM ranked_images
        WHERE rn = 1
      `,
      [properties.map((property) => property.id)],
    );
    const appPath = process.env.APP_PATH;
    properties.forEach((property) => {
      property.thumbnail_image = firstImages.find(
        (image) => image.property_id === property.id,
      );

      if (property.thumbnail_image) {
        property.thumbnail_image.url = `${appPath}/property/${property.id}/images/${property.thumbnail_image.id}`;
      }
    });
    return properties;
  }

  async create(data: DeepPartial<Property>): Promise<Property> {
    data.closing_costs_type = data.closing_costs_type || '$';
    data.selling_costs_type = data.selling_costs_type || '$';
    data.holding_costs_type = data.holding_costs_type || '$';
    data.rehab_costs_type = data.rehab_costs_type || '$';
    data.purchase_costs_type = data.purchase_costs_type || '$';

    if (data.closing_costs_type !== '$') {
      data.calc_closing_costs =
        (data.purchase_price * data.closing_costs) / 100;
    } else {
      data.calc_closing_costs = data.closing_costs;
    }

    if (data.selling_costs_type !== '$') {
      data.calc_selling_costs =
        (data.purchase_price * data.selling_costs) / 100;
    } else {
      data.calc_selling_costs = data.selling_costs;
    }

    if (data.purchase_costs_type !== '$') {
      data.calc_purchase_costs =
        (data.purchase_price * data.purchase_costs) / 100;
    } else {
      data.calc_purchase_costs = data.purchase_costs;
    }

    if (data.rehab_costs_type !== '$') {
      data.calc_rehab_costs = (data.purchase_price * data.rehab_costs) / 100;
    } else {
      data.calc_rehab_costs = data.rehab_costs;
    }

    if (data.holding_costs_type !== '$') {
      data.calc_holding_costs =
        (data.purchase_price * data.holding_costs) / 100;
    } else {
      data.calc_holding_costs = data.holding_costs;
    }

    const entity = this._repository.create(data);
    const retVal = await this._repository.save(entity);

    if (data.clear_closing_itemize_costs) {
      await this.removeAllClosingCosts(retVal.id);
    }

    if (data.clear_holding_itemize_costs) {
      await this.removeAllHoldingCosts(retVal.id);
    }

    if (data.clear_purchase_itemize_costs) {
      await this.removeAllPurchaseCosts(retVal.id);
    }

    if (data.clear_rehab_itemize_costs) {
      await this.removeAllRehabCosts(retVal.id);
    }

    if (data.clear_selling_itemize_costs) {
      await this.removeAllSellingCosts(retVal.id);
    }

    const states: any = await this.masterService.getStates();
    const state = states.find((state) => state.id === retVal.state);
    if (state) {
      try {
        const cities: any = await this.masterService.getCities(state.id);
        const city = cities.find((c) => c.id === retVal.city);
        const address =
          retVal.address +
          ', ' +
          state.name +
          ', ' +
          city.name +
          ', ' +
          retVal.zip_code;

        const geocodeResponse = await this.getGeocode(address);
        const location = geocodeResponse?.items?.[0]?.position;
        if (!location) throw new Error('Invalid geocode response');
        const full_address = geocodeResponse?.items?.[0]?.title;
        const property_unique_id = geocodeResponse?.items?.[0]?.id;
        const { lat, lng } = location;

        await this._repository
          .createQueryBuilder()
          .update(Property)
          .set({
            geocode_response: () => `:geocode_response::jsonb`,
            geocode: () => `ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)`, // POINT(longitude, latitude)
            full_address: () => `:full_address`,
            property_unique_id: () => `:property_unique_id`,
          })
          .where('id = :propertyId', { propertyId: retVal.id })
          .setParameters({
            geocode_response: JSON.stringify(geocodeResponse),
            lat,
            lng,
            full_address,
            property_unique_id,
          })
          .execute();
      } catch (exception) {
        // Geocoding is an enrichment step (map pin / full_address), not core
        // property data - the property row above is already saved by this
        // point. Failing here (e.g. no/invalid HERE_API_KEY, HERE returning
        // a 401) used to propagate straight through as this endpoint's own
        // response status, which made a missing third-party API key look
        // exactly like the user's own session had expired.
        console.error('Geocoding failed, property saved without it:', exception);
      }
    }
    await this.syncUserTags(data.userId);
    return retVal;
  }

  async getGeocode(address: string): Promise<any> {
    const apiUrl = 'https://geocode.search.hereapi.com/v1/geocode';
    const apiKey = process.env.HERE_API_KEY;
    try {
      const url = `${apiUrl}?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Geocoding failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createDocument(document: CreateDocumentDto) {
    const doc = await this._documentRepository.create(document);
    return await this._documentRepository.save(doc);
  }

  public async createPurchaseCosts(costsDto: CreateCostsDto[]) {
    if (!costsDto.length) {
      return null;
    }
    costsDto = await this.massageCosts(costsDto);
    const doc = this.purchaseCostsRepository.create(costsDto);
    const retVal = await this.purchaseCostsRepository.save(doc);
    await this.updatePurchaseCosts(costsDto[0].property_id);
    return retVal;
  }

  public async createRehabCosts(costsDto: CreateRehabCostsDto[]) {
    if (!costsDto.length) {
      return null;
    }
    costsDto = (await this.massageCosts(costsDto)) as CreateRehabCostsDto[];
    const doc = this.rehabCostsRepository.create(costsDto);
    const retVal = await this.rehabCostsRepository.save(doc);
    await this.updateRehabCosts(costsDto[0].property_id);
    return retVal;
  }

  public async createSellingCosts(costsDto: CreateCostsDto[]) {
    if (!costsDto.length) {
      return null;
    }
    costsDto = await this.massageCosts(costsDto);
    const doc = this.sellingCostsRepository.create(costsDto);
    const retVal = await this.sellingCostsRepository.save(doc);
    await this.updateSellingCosts(costsDto[0].property_id);
    return retVal;
  }

  public async createHoldingCosts(costsDto: CreateCostsDto[]) {
    if (!costsDto.length) {
      return null;
    }
    costsDto = await this.massageCosts(costsDto);
    const doc = this.holdingCostsRepository.create(costsDto);
    const retVal = await this.holdingCostsRepository.save(doc);
    await this.updateHoldingCosts(costsDto[0].property_id);
    return retVal;
  }

  public async createClosingCosts(costsDto: CreateCostsDto[]) {
    if (!costsDto.length) {
      return null;
    }
    costsDto = await this.massageCosts(costsDto);
    const doc = this.closingCostsRepository.create(costsDto);
    const retVal = await this.closingCostsRepository.save(doc);
    await this.updateClosingCosts(costsDto[0].property_id);
    return retVal;
  }

  public async createPropertyImage(dto: CreateDocumentDto) {
    const doc = this.imageRepository.create(dto);
    return await this.imageRepository.save(doc);
  }

  public async getPurchaseCosts(property_id: string) {
    return await this.purchaseCostsRepository.findBy({
      property_id: property_id,
    });
  }

  public async getSellingCosts(property_id: string) {
    return await this.sellingCostsRepository.findBy({
      property_id: property_id,
    });
  }

  public async getClosingCosts(property_id: string) {
    return await this.closingCostsRepository.findBy({
      property_id: property_id,
    });
  }

  public async getRehabCosts(property_id: string) {
    return await this.rehabCostsRepository.findBy({
      property_id: property_id,
    });
  }

  public async getHoldingCosts(property_id: string) {
    return await this.holdingCostsRepository.findBy({
      property_id: property_id,
    });
  }

  public async getDocuments(property_id: string) {
    const response = await this.dataSource.query(
      'select id, name from document where property_id = $1',
      [property_id],
    );

    const appPath = process.env.APP_PATH;

    return response.map((doc) => ({
      name: doc.name,
      url: `${appPath}/${property_id}/documents/${doc.id}`,
    }));
  }

  public async getImages(property_id: string) {
    const response = await this.dataSource.query(
      'select id, name from image where property_id = $1',
      [property_id],
    );

    const appPath = process.env.APP_PATH;

    return response.map((doc) => ({
      name: doc.name,
      url: `${appPath}/property/${property_id}/images/${doc.id}`,
    }));
  }

  public async getDocumentUrl(property_id: string, id: string) {
    const response = await this.dataSource.query(
      'select url, name from document where property_id = $1 and id = $2',
      [property_id, id],
    );
    return response[0];
  }

  public async getImageUrl(property_id: string, id: string) {
    const response = await this.dataSource.query(
      'select url, name from image where property_id = $1 and id = $2',
      [property_id, id],
    );
    return response[0];
  }

  public async removePurchaseCosts(property_id: string, ids: string[]) {
    await this.purchaseCostsRepository.delete(ids);
    await this.updatePurchaseCosts(property_id);
  }

  public async removeSellingCosts(property_id: string, ids: string[]) {
    await this.sellingCostsRepository.delete(ids);
    await this.updateSellingCosts(property_id);
  }

  public async removeClosingCosts(property_id: string, ids: string[]) {
    await this.closingCostsRepository.delete(ids);
    await this.updateClosingCosts(property_id);
  }

  public async removeHoldingCosts(property_id: string, ids: string[]) {
    await this.holdingCostsRepository.delete(ids);
    await this.updateHoldingCosts(property_id);
  }

  public async removeRehabCosts(property_id: string, ids: string[]) {
    await this.rehabCostsRepository.delete(ids);
    await this.updateRehabCosts(property_id);
  }

  public async updateFavouriteProperty(
    property_id: string,
    is_favorite: boolean = false,
  ) {
    await this.dataSource.query(
      'UPDATE property SET is_favorite = $1 WHERE id = $2',
      [is_favorite, property_id],
    );
  }

  public async createFinancing(financing: DeepPartial<Financing>[]) {
    if (!financing.length) {
      return [];
    }
    const property = await this.findOne(financing[0].property_id);
    financing.forEach((item) => {
      if (item.amount_type !== '$') {
        item.calc_amount = item.amount * property.purchase_price;
      } else {
        item.calc_amount = item.amount;
      }
      if (item.down_payment_type !== '$') {
        item.calc_down_payment = item.down_payment * property.purchase_price;
      } else {
        item.calc_down_payment = item.down_payment;
      }
    });
    const retVal = this._financingRepository.create(financing);
    await this._financingRepository.save(financing);
    return retVal;
  }

  public async getFinancing(property_id: string) {
    return await this.dataSource.query(
      'select * from financing where property_id = $1',
      [property_id],
    );
  }

  public async deleteFinancing(id: string) {
    await this._financingRepository.delete(id);
  }

  public async updateFinancing(id: string, financing: DeepPartial<Financing>) {
    const property = await this.findOne(financing.property_id);
    if (financing.amount_type !== '$') {
      financing.calc_amount = financing.amount * property.purchase_price;
    } else {
      financing.calc_amount = financing.amount;
    }
    if (financing.down_payment_type !== '$') {
      financing.calc_down_payment =
        financing.down_payment * property.purchase_price;
    } else {
      financing.calc_down_payment = financing.down_payment;
    }
    await this._financingRepository.update(id, financing);
  }

  public async bulkUpload(properties: DeepPartial<Property>[]) {
    const property_types: any = await this.masterService.getAllPropertyTypes();
    const tasks = [];

    properties.forEach((property) => {
      property.property_type_id = property_types.find(
        (pt) => pt.name === property.property_type,
      )?.id;
      tasks.push(property);
    });

    const batchSize = 10;
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      await Promise.all(batch.map((property) => this.create(property)));
    }
  }

  public async getPropertyDetails(id: string) {
    const property = {
      ...(await this.propertyRepository.findOne({
        where: { id } as any,
      })),
    };

    const details = new PropertyDetailsDto();
    Object.assign(details, property);

    const loans = await this.getFinancing(id);
    const loan_types: any = await this.masterService.getAllLoanTypes();
    const investmentStrategies: any =
      await this.masterService.getInvestmentStrategies();

    details.loan_amount = loans.reduce(
      (sum, loan) => Number(sum) + Number(loan.calc_amount),
      0,
    );
    details.interest_rate =
      loans.reduce((sum, loan) => Number(sum) + Number(loan.interest_rate), 0) /
      loans.length;
    details.loan_term = Math.max(
      ...loans.map((loan) => Number(loan.loan_term)),
    );
    details.down_payment = loans.reduce(
      (sum, loan) => Number(sum) + Number(loan.calc_down_payment),
      0,
    );

    details.loan_type = [
      ...new Set(
        loans.map(
          (loan) => loan_types.find((pt) => pt.id === loan.loan_type_id)?.name,
        ),
      ),
    ].join();

    details.loan_percentage =
      (details.loan_amount * 100) / Number(details.purchase_price);

    details.total_purchase_cost =
      Number(details.selling_costs) +
      Number(details.calc_closing_costs) +
      Number(details.calc_holding_costs) +
      Number(details.rehab_costs) +
      Number(details.purchase_price);

    details.total_cash_needed =
      Number(details.total_purchase_cost) -
      Number(details.selling_costs) -
      Number(details.loan_amount);

    details.roi = details.arv - details.total_purchase_cost;

    details.loan_to_cost = details.loan_amount / details.total_cash_needed;

    details.loan_to_value =
      (details.loan_amount * 100) / details.purchase_price;

    details.arv_per_square_foot =
      details.total_cash_needed / details.square_feet;

    details.price_per_square_foot =
      details.purchase_price / details.square_feet;

    details.rehab_per_square_foot = details.rehab_costs / details.square_feet;
    details.investment_strategy = investmentStrategies.find(
      (i) => i.id === details.investment_strategy_id,
    )?.name;
    return details;
  }

  async syncUserTags(user_id: string) {
    // Note: this used to be a single `MERGE INTO` statement, but MERGE was
    // only added in Postgres 15 - this app runs on Postgres 13 (see
    // docker-compose.yml), so it always threw a syntax error, meaning every
    // property create/update 500'd here even though the property itself had
    // already been saved successfully moments earlier in the same call.
    const [row] = await this.dataSource.manager.query(
      `
        SELECT string_agg(DISTINCT trim(tag), ', ' ORDER BY trim(tag)) AS merged_tags
        FROM (
          SELECT unnest(string_to_array(tags_n_labels, ',')) AS tag
          FROM property
          WHERE tags_n_labels IS NOT NULL
            AND "userId" = $1
        ) AS split_tags
      `,
      [user_id],
    );
    const mergedTags = row?.merged_tags;
    if (!mergedTags) {
      return;
    }

    const userTagsRepository = this.dataSource.getRepository(UserTags);
    const existing = await userTagsRepository.findOne({
      where: { userId: user_id },
    });
    if (existing) {
      await userTagsRepository.update({ userId: user_id }, { tags: mergedTags });
    } else {
      await userTagsRepository.insert({ userId: user_id, tags: mergedTags });
    }
  }

  async pullPropertyDetails(address: string) {
    const json = await this.rentCastService.getPropertyDataByAddressOrUniqueId(
      address,
      null,
    );
    return await this.mapJsonToPropertyEntity(json);
  }

  mapPropertyType(type: string) {
    const propertyTypeMapping = {
      'Single Family': 'House',
      Condo: 'Condo',
      Townhouse: 'House',
      Manufactured: 'Manufactured',
      'Multi-Family': 'Multi-Family',
      Apartment: 'Commercial',
      Land: 'Land',
    };
    return propertyTypeMapping[type] ?? 'Other';
  }

  async mapJsonToPropertyEntity(rentCastData: any) {
    const propertyTypes: any = await this.masterService.getAllPropertyTypes();
    const property = new CreatePropertyDto();
    const mappedType = this.mapPropertyType(rentCastData.propertyType);
    const mappedTypeId = propertyTypes.find((p) => p.name === mappedType)?.id;
    // Required fields
    property.address =
      rentCastData.addressLine1 || rentCastData.formattedAddress;
    property.city = rentCastData.city;
    property.state = rentCastData.state;
    property.zip_code = rentCastData.zipCode;
    property.property_type_id = mappedTypeId;
    property.title = rentCastData.formattedAddress;

    property.bathrooms = rentCastData.bathrooms;
    property.bedrooms = rentCastData.bedrooms;
    property.square_feet = rentCastData.squareFootage;
    property.lot_size = rentCastData.lotSize;
    property.year_built = rentCastData.yearBuilt;

    // Property details
    property.zoning = rentCastData.zoning;

    // Location and subdivision
    if (rentCastData.subdivision) {
      property.location = rentCastData.subdivision;
    }

    // Lot size type determination
    if (rentCastData.lotSize) {
      property.lot_size_type = 'square_feet'; // Default to square feet
    }

    // Parking spaces from garage information
    if (rentCastData.features?.garageSpaces) {
      property.parking = rentCastData.features.garageSpaces;
    }

    // MLS number from additional data
    if (rentCastData.additional?.mlsNumber) {
      property.mls_number = rentCastData.additional.mlsNumber;
    }

    // Purchase price from last sale
    if (rentCastData.lastSalePrice) {
      property.purchase_price = rentCastData.lastSalePrice;
    }

    // Estimated values from various sources
    if (
      rentCastData.additional?.estimatedPrices &&
      rentCastData.additional.estimatedPrices.length > 0
    ) {
      const recentEstimate = rentCastData.additional.estimatedPrices[0];
      property.listing_price = recentEstimate.amountMax;
      property.estimated_arv = recentEstimate.amountMax;
      property.after_repair_value = recentEstimate.amountMax;
    }

    // Market stats for estimated values
    if (rentCastData.additional?.marketStats?.medianListPrice) {
      const medianPrice =
        parseFloat(
          rentCastData.additional.marketStats.medianListPrice.replace(
            /[$K,]/g,
            '',
          ),
        ) * 1000;
      if (!property.listing_price) {
        property.listing_price = medianPrice;
      }
    }

    // Tax assessments for ARV estimation
    if (rentCastData.taxAssessments) {
      const years = Object.keys(rentCastData.taxAssessments).sort().reverse();
      if (years.length > 0) {
        const mostRecentAssessment = rentCastData.taxAssessments[years[0]];
        if (!property.estimated_arv && mostRecentAssessment.value) {
          property.estimated_arv = mostRecentAssessment.value;
        }
      }
    }

    // Property description from additional data
    if (
      rentCastData.additional?.descriptions &&
      rentCastData.additional.descriptions.length > 0
    ) {
      property.description = rentCastData.additional.descriptions[0].value;
    }

    // Store complex data as JSON strings for reference
    if (rentCastData.features) {
      property.notes = JSON.stringify({
        features: rentCastData.features,
        assessorID: rentCastData.assessorID,
        legalDescription: rentCastData.legalDescription,
        county: rentCastData.county,
        ownerOccupied: rentCastData.ownerOccupied,
        lastSaleDate: rentCastData.lastSaleDate,
        hoa: rentCastData.hoa,
      });
    }
    // Set default values
    property.is_favorite = false;

    // Cost calculation defaults (you may want to customize these)
    property.closing_costs_type = 'percentage';
    property.purchase_costs_type = 'percentage';
    property.selling_costs_type = 'percentage';
    property.rehab_costs_type = 'fixed';
    property.holding_costs_type = 'monthly';

    return {
      ...rentCastData,
      ...property,
      propertyType: mappedType,
      price: property.listing_price ?? property.purchase_price ?? property.estimated_arv ?? null,
      numberOfFloors: rentCastData.features?.floorCount ?? rentCastData.noofStories ?? null,
    };
  }

  protected applySearch(
    query: SelectQueryBuilder<Property>,
    searchKey: string,
  ): void {
    if (searchKey) {
      query.andWhere(
        `(address ILIKE :searchKeyStr or title ILIKE :searchKeyStr or full_address ILIKE :searchKeyStr)`,
        {
          ['searchKeyStr']: `%${searchKey}%`,
        },
      );
    }
  }

  protected applyFilters(
    query: SelectQueryBuilder<Property>,
    filters: Record<string, any>,
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      const paramKey = key.replace(/[^a-zA-Z0-9_]/g, '_'); // Sanitize key
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array values (e.g., WHERE key IN (...))
          query.andWhere(`${key} IN (:...${paramKey})`, { [paramKey]: value });
        } else if (typeof value === 'string' && value.includes('%')) {
          // Handle LIKE conditions (wildcards)
          query.andWhere(`${key} LIKE :${paramKey}`, { [paramKey]: value });
        } else {
          // Handle exact match
          query.andWhere(`${key} = :${paramKey}`, { [paramKey]: value });
        }
      }
    });
  }

  private async massageCosts(costsDto: CreateCostsDto[]) {
    const property = await this.findOne(costsDto[0].property_id);
    costsDto.forEach((item) => {
      item.amount_type = item.amount_type || '$';
      let amount =
        item.amount_type === '%'
          ? (item.amount / 100) *
            (item.purchase_price || property.purchase_price || 0)
          : item.amount;
      if (item.period_type) {
        if (item.period_type === 'pa') {
          amount = (amount / 12) * item.no_of_periods;
        } else {
          amount = amount * item.no_of_periods;
        }
      }
      item.calculated_amount = amount;
    });
    return costsDto;
  }

  private async removeAllPurchaseCosts(property_id: string) {
    const response = await this.dataSource.query(
      'delete from purchase_costs where property_id = $1',
      [property_id],
    );
    return response[0];
  }

  private async removeAllClosingCosts(property_id: string) {
    await this.dataSource.query(
      'delete from closing_costs where property_id = $1',
      [property_id],
    );
  }

  private async removeAllSellingCosts(property_id: string) {
    await this.dataSource.query(
      'delete from selling_costs where property_id = $1',
      [property_id],
    );
  }

  private async removeAllHoldingCosts(property_id: string) {
    await this.dataSource.query(
      'delete from holding_costs where property_id = $1',
      [property_id],
    );
  }

  private async removeAllRehabCosts(property_id: string) {
    await this.dataSource.query(
      'delete from rehab_costs where property_id = $1',
      [property_id],
    );
  }

  private async updatePurchaseCosts(property_id: string) {
    const output = await this.dataSource.query(
      'select sum(calculated_amount) as total from purchase_costs where property_id = $1',
      [property_id],
    );

    await this.dataSource.query(
      'UPDATE property SET purchase_costs = $1 WHERE id = $2',
      [output[0].total, property_id],
    );
  }

  private async updateSellingCosts(property_id: string) {
    const output = await this.dataSource.query(
      'select sum(calculated_amount) as total from selling_costs where property_id = $1',
      [property_id],
    );

    await this.dataSource.query(
      'UPDATE property SET selling_costs = $1 WHERE id = $2',
      [output[0].total, property_id],
    );
  }

  private async updateClosingCosts(property_id: string) {
    const output = await this.dataSource.query(
      'select sum(calculated_amount) as total from closing_costs where property_id = $1',
      [property_id],
    );

    await this.dataSource.query(
      'UPDATE property SET closing_costs = $1 WHERE id = $2',
      [output[0].total, property_id],
    );
  }

  private async updateRehabCosts(property_id: string) {
    const output = await this.dataSource.query(
      'select sum(calculated_amount) as total from rehab_costs where property_id = $1',
      [property_id],
    );

    await this.dataSource.query(
      'UPDATE property SET rehab_costs = $1 WHERE id = $2',
      [output[0].total, property_id],
    );
  }

  private async updateHoldingCosts(property_id: string) {
    const output = await this.dataSource.query(
      'select sum(calculated_amount) as total from holding_costs where property_id = $1',
      [property_id],
    );

    await this.dataSource.query(
      'UPDATE property SET holding_costs = $1 WHERE id = $2',
      [output[0].total, property_id],
    );
  }
}
