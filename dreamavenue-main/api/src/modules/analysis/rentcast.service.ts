import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropQuery } from './entities/prop_query.entity';
import { Property } from '../property/entities/property.entity';
import * as process from 'node:process';
import { DatafinitiService } from './datafiniti.service';
import { UtilService } from '../common/util-service';
import axios from 'axios';
import { ThirdPartyProperty } from './models/thirdparty.property.classes.dto';

@Injectable()
export class RentcastService {
  allowed_properties = [
    'here:af:streetsection:L0YHiKe5J-9hFw0janKJmD:CgcIBCDisZoTEAEaAzgwMw',
    'here:af:streetsection:pD5X.p63mynYsnCBoL4dOC:CgcIBCCCnpsTEAEaBDY4Mjg',
    'here:af:streetsection:WH8exF9QGYW8rnktUc-UFC:CgcIBCD59_YTEAEaBDEyNDU',
    'here:af:streetsection:mn5Ge9q8S7I4Yb4GbtbAuD:EAIaAzEwMA',
    'here:af:streetsection:jthCxC9NZoO6F8OrezUdeB:CggIBCDzypryAhABGgMxMDA',
    'here:af:streetsection:fXlabdTxikzqcetrpQ4u2B:EAIaATI',
  ];
  private readonly apiKey = process.env.RENTCAST_API_KEY;
  private readonly baseUrl = 'https://api.rentcast.io/v1';
  private _propQueryRepository: Repository<PropQuery>;
  private _propertyRepository: Repository<Property>;

  constructor(
    private readonly httpService: HttpService,
    private readonly utilService: UtilService,
    @InjectRepository(Property)
    propertyRepository: Repository<Property>,
    @InjectRepository(PropQuery)
    propQueryRepository: Repository<PropQuery>,
    private readonly datafinitiService: DatafinitiService,
  ) {
    this._propQueryRepository = propQueryRepository;
    this._propertyRepository = propertyRepository;
  }

  async getPropertyData(propertyId: string): Promise<any> {
    const property = await this._propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (
      process.env.DEV_MODE === 'true' &&
      !this.allowed_properties.includes(property.property_unique_id)
    ) {
      return {};
    }
    return this.getPropertyDataByAddressOrUniqueId(
      property.full_address,
      property.property_unique_id,
    );
  }

  async getPropertyDataByAddressOrUniqueId(address: string, uniqueId: string) {
    const key1 = `property-${uniqueId}`;
    const standardAddress = await this.utilService.toFormattedAddress(address);
    const key2 = `property-${standardAddress}`;

    const parsedAddress = await this.utilService.parse(address);
    const propQuery = await this._propQueryRepository.findOne({
      where: [{ key: key1 }, { key: key2 }],
    });
    if (!propQuery) {
      let rentCastData = null;

      try {
        const url = `${this.baseUrl}/properties`;
        const response$ = this.httpService.get(url, {
          params: { address: address },
          headers: {
            'X-Api-Key': this.apiKey,
          },
        });
        const { data } = await firstValueFrom(response$);
        rentCastData = data.length > 0 ? data[0] : null;
      } catch (exception) {
        console.error(exception);
      }
      rentCastData = rentCastData || {};
      const thirdPartyData =
        await this.getDataFromThirdPartyService(standardAddress);
      const targetCity = parsedAddress['city']?.toLowerCase().trim();
      const targetState = parsedAddress['state']?.toLowerCase().trim();
      const cityMismatch =
        thirdPartyData?.propertyCityName &&
        targetCity &&
        thirdPartyData.propertyCityName.toLowerCase().trim() !== targetCity;
      const stateMismatch =
        thirdPartyData?.propertyState &&
        targetState &&
        thirdPartyData.propertyState.toLowerCase().trim() !== targetState;
      // Discard the third-party match if it's clearly a different property
      // (e.g. same street number/name but a different city/state) rather than
      // blending two unrelated properties' data together.
      const validThirdPartyData =
        cityMismatch || stateMismatch ? {} : thirdPartyData;
      const extRentCastData = this.fillMissingData(
        rentCastData,
        validThirdPartyData,
      );
      const dfData =
        await this.datafinitiService.getPropertyByNormalizedAddress(
          parsedAddress['address'],
          parsedAddress['city'],
          parsedAddress['state'],
          parsedAddress['zip'],
        );
      const finalData =
        dfData && dfData.length
          ? this.mergePropertyData(extRentCastData, dfData)
          : extRentCastData;
      const pqs = [];

      if (uniqueId) {
        const pq1 = {
          key: key1,
          response: JSON.stringify(finalData),
        };
        pqs.push(pq1);
      }
      if (address) {
        const pq2 = {
          key: key2,
          response: JSON.stringify(finalData),
        };
        pqs.push(pq2);
      }
      this._propQueryRepository.create(pqs);
      await this._propQueryRepository.save(pqs);

      return finalData;
    } else {
      return propQuery.response;
    }
  }

  async getRentalComps(propertyId: string): Promise<any> {
    const property = await this._propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (
      process.env.DEV_MODE === 'true' &&
      !this.allowed_properties.includes(property.property_unique_id)
    ) {
      return {};
    }
    const key = `rent-comps-${property.property_unique_id}`;
    const propQuery = await this._propQueryRepository.findOne({
      where: { key: key },
    });
    if (!propQuery) {
      const url = `${this.baseUrl}/avm/rent/long-term`;
      const response$ = this.httpService.get(url, {
        params: { address: property.full_address },
        headers: {
          'X-Api-Key': this.apiKey,
          accept: 'application/json',
        },
      });
      const { data } = await firstValueFrom(response$);
      const pq = {
        key: key,
        response: data,
      };
      this._propQueryRepository.create(pq);
      await this._propQueryRepository.save(pq);
      return data;
    } else {
      return propQuery.response;
    }
  }

  extractNumericValue(str: string): number | undefined {
    const match = str.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : undefined;
  }

  extractPercentage(str: string): string | undefined {
    const match = str.match(/[\d.]+%/);
    return match ? match[0] : undefined;
  }

  parseTransportScores(values: string[]): {
    biking?: string;
    walking?: string;
    transit?: string;
  } {
    const scores: { biking?: string; walking?: string; transit?: string } = {};

    values.forEach((value) => {
      if (value.includes('Biking Score')) {
        scores.biking = value;
      } else if (value.includes('Walking Score')) {
        scores.walking = value;
      } else if (value.includes('Transit Score')) {
        scores.transit = value;
      }
    });

    return scores;
  }

  parseMarketStats(
    values: string[],
  ): RentcastProperty['additional']['marketStats'] {
    const stats: RentcastProperty['additional']['marketStats'] = {};

    values.forEach((value) => {
      if (value.includes('Avg. # Offers')) {
        stats.avgOffers = this.extractNumericValue(value);
      } else if (value.includes('Avg. Down Payment')) {
        stats.avgDownPayment = this.extractPercentage(value);
      } else if (value.includes('Median Sale / List')) {
        stats.medianSaleToList = this.extractPercentage(value);
      } else if (value.includes('# Sold Homes')) {
        stats.soldHomes = this.extractNumericValue(value);
      } else if (value.includes('Median List Price')) {
        stats.medianListPrice = value.split(':')[1]?.trim();
      } else if (value.includes('Median $ / Sq. Ft.')) {
        stats.medianPricePerSqFt = value.split(':')[1]?.trim();
      }
    });

    return stats;
  }

  parsePriceHistory(
    values: string[],
  ): Array<{ date: string; price: string; event: string }> {
    return values.map((value) => {
      const parts = value.split(' - ');
      const datePart = parts[0]?.replace('Date: ', '');
      const pricePart = parts[1]?.replace('Price: ', '');
      const eventPart = parts[2]?.replace('Event: ', '');

      return {
        date: datePart || '',
        price: pricePart || '',
        event: eventPart || '',
      };
    });
  }

  mergePropertyData(
    rentcastData: RentcastProperty | null,
    datafinitiData: DatafinitiResponse | null,
  ) {
    // If no data from either source, return null
    if (
      !rentcastData &&
      (!datafinitiData || datafinitiData.records.length === 0)
    ) {
      return rentcastData;
    }

    // If only Rentcast data, return as is
    if (!datafinitiData || datafinitiData.records.length === 0) {
      return rentcastData;
    }

    const datafinitiRecord = datafinitiData.records[0];

    // If only Datafiniti data, create Rentcast structure
    if (!rentcastData) {
      // const addressParts = datafinitiRecord.address.split(' ');
      // const streetNumber = addressParts[0] || '';
      // const streetName = addressParts.slice(1).join(' ');

      return {
        id: datafinitiRecord.id,
        formattedAddress: `${datafinitiRecord.address}, ${datafinitiRecord.city}, ${datafinitiRecord.province} ${datafinitiRecord.postalCode}`,
        addressLine1: datafinitiRecord.address,
        addressLine2: null,
        city: datafinitiRecord.city,
        state: datafinitiRecord.province,
        zipCode: datafinitiRecord.postalCode,
        county: datafinitiRecord.county,
        latitude: parseFloat(datafinitiRecord.latitude),
        longitude: parseFloat(datafinitiRecord.longitude),
        propertyType: datafinitiRecord.propertyType,
        bathrooms: datafinitiRecord.numBathroom,
        squareFootage: datafinitiRecord.floorSizeValue,
        lotSize: datafinitiRecord.lotSizeValue,
        yearBuilt: datafinitiRecord.yearBuilt,
        legalDescription: datafinitiRecord.legalDescription,
        subdivision: datafinitiRecord.subdivision,
        features: {
          floorCount: datafinitiRecord.numFloor,
        },
      };
    }

    // Merge both datasets, with Rentcast taking priority
    const merged: RentcastProperty = { ...rentcastData };

    // Add additional Datafiniti data
    merged.additional = {
      dateAdded: datafinitiRecord.dateAdded,
      dateUpdated: datafinitiRecord.dateUpdated,
      descriptions: datafinitiRecord.descriptions,
      estimatedPrices: datafinitiRecord.estimatedPrices?.map((price) => ({
        amountMax: price.amountMax,
        amountMin: price.amountMin,
        currency: price.currency,
        dateSeen: price.dateSeen,
        pricePerSquareFoot: price.pricePerSquareFoot,
      })),
      mlsNumber: datafinitiRecord.mlsNumber,
      neighborhoods: datafinitiRecord.neighborhoods,
      recentStatus: datafinitiRecord.mostRecentStatus,
      recentStatusDate: datafinitiRecord.mostRecentStatusDate,
    };
    merged.features = {};
    // Process features and extract additional information
    datafinitiRecord.features?.forEach((feature) => {
      switch (feature.key) {
        case 'Exterior Information':
          feature.value.forEach((value) => {
            if (value.includes('Construction Type:')) {
              merged.features.constructionType = value.split(':')[1]?.trim();
            } else if (value.includes('Foundation Type:')) {
              merged.features.foundationType =
                merged.features.foundationType || value.split(':')[1]?.trim();
            } else if (value.includes('Roof Shape Type:')) {
              merged.features.roofShape = value.split(':')[1]?.trim();
            } else if (value.includes('Building Type:')) {
              merged.features.buildingType = value.split(':')[1]?.trim();
            }
          });
          break;

        case 'Property Information':
          feature.value.forEach((value) => {
            if (value.includes('Stories Type:')) {
              merged.features.storiesType = value.split(':')[1]?.trim();
            } else if (value.includes('# of Stories:')) {
              const stories = this.extractNumericValue(value);
              if (stories) merged.features.stories = stories;
            }
          });
          break;

        case 'Heating & Cooling':
          feature.value.forEach((value) => {
            if (value.includes('Heating Type:')) {
              merged.features.heatingType =
                merged.features.heatingType || value.split(':')[1]?.trim();
            } else if (value.includes('Air Conditioning Type:')) {
              merged.features.coolingType =
                merged.features.coolingType || value.split(':')[1]?.trim();
            }
          });
          break;

        case 'Postal Code (78721) Transport Scores':
          merged.additional.transportScores = this.parseTransportScores(
            feature.value,
          );
          break;

        case 'Postal Code (78721) Real Estate Sales (Last 30 Days)':
          merged.additional.marketStats = this.parseMarketStats(feature.value);
          break;

        case 'Nearby Recently Sold Homes':
          merged.additional.nearbyHomes = {
            ...merged.additional.nearbyHomes,
            recentlySold: feature.value,
          };
          break;

        case 'Nearby Similar Homes':
          merged.additional.nearbyHomes = {
            ...merged.additional.nearbyHomes,
            similar: feature.value,
          };
          break;

        case 'Price History - Redfin':
          merged.additional.priceHistory = this.parsePriceHistory(
            feature.value,
          );
          break;

        case 'Tax Record':
          // Extract tax information if not already present in Rentcast data
          if (!merged.propertyTaxes && feature.value.length > 0) {
            const taxMatch = feature.value[0].match(/(\d{4}):\s*\$?([\d,]+)/);
            if (taxMatch) {
              const year = taxMatch[1];
              const amount = parseInt(taxMatch[2].replace(/,/g, ''));
              merged.propertyTaxes = {
                [year]: {
                  year: parseInt(year),
                  total: amount,
                },
              };
            }
          }
          break;
      }
    });

    // Fill in missing basic fields from Datafiniti if not present in Rentcast
    if (!merged.legalDescription && datafinitiRecord.legalDescription) {
      merged.legalDescription = datafinitiRecord.legalDescription;
    }

    if (!merged.subdivision && datafinitiRecord.subdivision) {
      merged.subdivision = datafinitiRecord.subdivision;
    }

    if (!merged.yearBuilt && datafinitiRecord.yearBuilt) {
      merged.yearBuilt = datafinitiRecord.yearBuilt;
    }

    if (!merged.bathrooms && datafinitiRecord.numBathroom) {
      merged.bathrooms = datafinitiRecord.numBathroom;
    }

    if (!merged.squareFootage && datafinitiRecord.floorSizeValue) {
      merged.squareFootage = datafinitiRecord.floorSizeValue;
    }

    if (!merged.lotSize && datafinitiRecord.lotSizeValue) {
      merged.lotSize = datafinitiRecord.lotSizeValue;
    }

    if (!merged.features.floorCount && datafinitiRecord.numFloor) {
      merged.features.floorCount = datafinitiRecord.numFloor;
    }

    return merged;
  }

  public async getDataFromThirdPartyService(address: string): Promise<any> {
    const response = await axios.get(
      'https://www.enrichedrealestate.com/SearchByAddress',
      {
        params: {
          inputs: `{ "address": "${address}"}`,
        },
      },
    );
    const propertyDetails = response.data.property[0];
    if (propertyDetails) {
      const [
        salesHistoryRes,
        mortgageHistoryRes,
        assessmentHistoryRes,
        rentRollRes,
      ] = await Promise.all([
        axios.get(
          'https://www.enrichedrealestate.com/GetSaleAndMortgageHistoryByPropertyId',
          {
            params: {
              propertyId: propertyDetails.id,
              transactionTypeId: '1',
              propertyTypeId: '1',
            },
          },
        ),
        axios.get(
          'https://www.enrichedrealestate.com/GetSaleAndMortgageHistoryByPropertyId',
          {
            params: {
              propertyId: propertyDetails.id,
              transactionTypeId: '3',
              propertyTypeId: '1',
            },
          },
        ),
        axios.get(
          'https://www.enrichedrealestate.com/GetAssessmentHistoryByPropertyId',
          {
            params: {
              propertyId: propertyDetails.id,
            },
          },
        ),
        axios.get(
          'https://www.enrichedrealestate.com/GetRentRollyDetailsByPropertyId',
          {
            params: {
              propertyId: propertyDetails.id,
            },
          },
        ),
      ]);

      propertyDetails.salesHistory = salesHistoryRes.data;
      propertyDetails.mortgageHistory = mortgageHistoryRes.data;
      propertyDetails.assessmentHistory = assessmentHistoryRes.data;
      propertyDetails.rentRoll = rentRollRes.data.propertyRentRollDetails;
    }
    return propertyDetails || {};
  }

  private fillMissingData(
    rentcastProperty: RentcastProperty,
    thirdPartyProperty: ThirdPartyProperty,
  ): any {
    return {
      // Start with all RentcastProperty data
      ...rentcastProperty,

      // Core property information - only fill if missing in Rentcast
      id:
        rentcastProperty.id ||
        thirdPartyProperty.propertyId?.toString() ||
        thirdPartyProperty.id?.toString(),
      formattedAddress:
        rentcastProperty.formattedAddress ||
        thirdPartyProperty.propertyFullStreetAddress,
      addressLine1:
        rentcastProperty.addressLine1 ||
        this.extractAddressLine1(thirdPartyProperty.propertyFullStreetAddress),
      addressLine2:
        rentcastProperty.addressLine2 ||
        thirdPartyProperty.propertyUnitNumber ||
        null,
      city: rentcastProperty.city || thirdPartyProperty.propertyCityName,
      state: rentcastProperty.state || thirdPartyProperty.propertyState,
      zipCode: rentcastProperty.zipCode || thirdPartyProperty.propertyZipCode,
      county: rentcastProperty.county || '', // ThirdParty doesn't have county

      // Coordinates - fill if missing in Rentcast
      latitude:
        rentcastProperty.latitude ||
        thirdPartyProperty.location?.latitude ||
        parseFloat(thirdPartyProperty.yCoordinate),
      longitude:
        rentcastProperty.longitude ||
        thirdPartyProperty.location?.longitude ||
        parseFloat(thirdPartyProperty.xCoordinate),

      // Property type
      propertyType:
        rentcastProperty.propertyType || thirdPartyProperty.propertyType,

      // Building measurements - only fill if missing or 0 in Rentcast
      squareFootage: this.fillIfMissing(
        rentcastProperty.squareFootage,
        thirdPartyProperty.buildingArea,
      ),
      lotSize: this.fillIfMissing(
        rentcastProperty.lotSize,
        parseFloat(thirdPartyProperty.lotSizeSquareFeet) || 0,
      ),
      yearBuilt: this.fillIfMissing(
        rentcastProperty.yearBuilt,
        thirdPartyProperty.yearBuilt,
      ),

      // Assessment information
      assessorID:
        rentcastProperty.assessorID || thirdPartyProperty.assessorsParcelNumber,
      legalDescription:
        rentcastProperty.legalDescription ||
        thirdPartyProperty.legalBriefDescription,
      subdivision:
        rentcastProperty.subdivision || thirdPartyProperty.subDivison,

      // Sale information - fill if missing in Rentcast
      lastSaleDate:
        rentcastProperty.lastSaleDate ||
        thirdPartyProperty.latestSaleRecordingDate ||
        thirdPartyProperty.transactionSaleDate,
      lastSalePrice: this.fillIfMissing(
        rentcastProperty.lastSalePrice,
        thirdPartyProperty.salePriceFromTransaction ||
          thirdPartyProperty.transactionSalePrice,
      ),

      // Owner information - merge intelligently
      owner: this.mergeOwnerInfo(rentcastProperty.owner, thirdPartyProperty),

      // Features - enhance with unit count if missing
      features: {
        ...rentcastProperty.features,
        unitCount:
          rentcastProperty.features?.unitCount ||
          thirdPartyProperty.numberofUnits,
        floorCount:
          rentcastProperty.features?.floorCount ||
          this.parseStories(thirdPartyProperty.noofStories),
        roomCount: rentcastProperty.features?.roomCount || undefined, // Not available in ThirdParty
      },

      // Tax assessments - merge with ThirdParty data
      taxAssessments: this.mergeTaxAssessments(
        rentcastProperty.taxAssessments,
        thirdPartyProperty,
      ),

      // Transaction history - merge with ThirdParty data
      history: this.mergeTransactionHistory(
        rentcastProperty.history,
        thirdPartyProperty,
      ),

      // Additional information - enhance with update date
      additional: {
        ...rentcastProperty.additional,
        dateUpdated:
          rentcastProperty.additional?.dateUpdated ||
          thirdPartyProperty.lastUpdatedOn,
      },

      // Fill all additional fields from ThirdPartyProperty
      assessedLandValue: thirdPartyProperty.assessedLandValue,
      assessedImprovementValue: thirdPartyProperty.assessedImprovementValue,
      totalAssessedValue: thirdPartyProperty.totalAssessedValue,
      totalMarketValue: thirdPartyProperty.totalMarketValue,
      marketValueLand: thirdPartyProperty.marketValueLand,
      totalAssessedValuePerSQFT: thirdPartyProperty.totalAssessedValuePerSQFT,
      totalMarketValuePerSQFT: thirdPartyProperty.totalMarketValuePerSQFT,

      category: thirdPartyProperty.category,
      subcategory: thirdPartyProperty.subcategory,
      propertyGrade: thirdPartyProperty.propertyGrade,
      buildingClass: thirdPartyProperty.buildingClass,

      numberofUnits: thirdPartyProperty.numberofUnits,
      noofBuildings: thirdPartyProperty.noofBuildings,
      noofStories: thirdPartyProperty.noofStories,
      actualOccupancy: thirdPartyProperty.actualOccupancy,

      potentialGrossIncome: thirdPartyProperty.potentialGrossIncome,
      vacancy: thirdPartyProperty.vacancy,
      effectiveGrossIncome: thirdPartyProperty.effectiveGrossIncome,
      expenses: thirdPartyProperty.expenses,
      nOI: thirdPartyProperty.nOI,

      priorMortgageAmount: thirdPartyProperty.priorMortgageAmount,
      priorMortgageDate: thirdPartyProperty.priorMortgageDate,
      priorMortgagePricePerSqFt: thirdPartyProperty.priorMortgagePricePerSqFt,
      priorMortgageYear: thirdPartyProperty.priorMortgageYear,

      adjustedPSF: thirdPartyProperty.adjustedPSF,
      transactionGBA: thirdPartyProperty.transactionGBA,
      transactionLotSize: thirdPartyProperty.transactionLotSize,
      transactionSalePricePerSqFt:
        thirdPartyProperty.transactionSalePricePerSqFt,

      assessmentYear: thirdPartyProperty.assessmentYear,
      yearRenovated: thirdPartyProperty.yearRenovated,
      signatureDate: thirdPartyProperty.signatureDate,
      multipleproperty: thirdPartyProperty.multipleproperty,
      detailPageURL: thirdPartyProperty.detailPageURL,
      imageURL: thirdPartyProperty.imageURL,

      fips: thirdPartyProperty.fips,
      censusTract: thirdPartyProperty.censusTract,
      frontage: thirdPartyProperty.frontage,
      distance: thirdPartyProperty.distance,
      milesFromSubject: thirdPartyProperty.milesFromSubject,

      // Buyer/Seller information
      buyerName: thirdPartyProperty.buyerName,
      sellerName: thirdPartyProperty.sellerName,
      buyerCompany: thirdPartyProperty.buyerCompany,
      sellerCompany: thirdPartyProperty.sellerCompany,
      buyerAddress: thirdPartyProperty.buyerAddress,
      sellerAddress: thirdPartyProperty.sellerAddress,
      buyerPhoneNumber: thirdPartyProperty.buyerPhoneNumber,
      sellerPhoneNumber: thirdPartyProperty.sellerPhoneNumber,
      buyerEmail: thirdPartyProperty.buyerEmail,
      sellerEmail: thirdPartyProperty.sellerEmail,

      metaDescription: thirdPartyProperty.metaDescription,
      metaKeyWords: thirdPartyProperty.metaKeyWords,
      metaURL: thirdPartyProperty.metaURL,

      // Additional fields
      parcelID: thirdPartyProperty.parcelID,
      taxAccountNumber: thirdPartyProperty.taxAccountNumber,
      staticMapURL: thirdPartyProperty.staticMapURL,
      filmcode: thirdPartyProperty.filmcode,
      transactionSalePriceRangeFrom:
        thirdPartyProperty.transactionSalePriceRangeFrom,
      transactionSalePriceRangeTo:
        thirdPartyProperty.transactionSalePriceRangeTo,
      transactionSalePricePSFRangeFrom:
        thirdPartyProperty.transactionSalePricePSFRangeFrom,
      transactionSalePricePSFRangeTo:
        thirdPartyProperty.transactionSalePricePSFRangeTo,
      transactionbuyerEntityName: thirdPartyProperty.transactionbuyerEntityName,
      transactionsellerEntityName:
        thirdPartyProperty.transactionsellerEntityName,
      transactionbuyerName: thirdPartyProperty.transactionbuyerName,
      es_Flag: thirdPartyProperty.es_Flag,
      debugvalue: thirdPartyProperty.debugvalue,
      nra: thirdPartyProperty.nra,
      salesHistory: thirdPartyProperty.salesHistory,
      mortgageHistory: thirdPartyProperty.mortgageHistory,
      assessmentHistory: thirdPartyProperty.assessmentHistory,
      rentRoll: thirdPartyProperty.rentRoll,
    };
  }

  /**
   * Helper method to fill value only if original is missing, null, undefined, or 0
   */
  private fillIfMissing<T>(original: T, fallback: T): T {
    if (
      original === null ||
      original === undefined ||
      original === 0 ||
      original === ''
    ) {
      return fallback;
    }
    return original;
  }

  /**
   * Helper method to extract address line 1 from full address
   */
  private extractAddressLine1(fullAddress: string): string {
    if (!fullAddress) return '';
    const parts = fullAddress.split(',');
    return parts.length > 1 ? parts.slice(0, -2).join(',').trim() : fullAddress;
  }

  /**
   * Helper method to parse stories string to number
   */
  private parseStories(stories: string): number | undefined {
    if (!stories) return undefined;
    const parsed = parseInt(stories);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Merge owner information, keeping Rentcast data as primary
   */
  private mergeOwnerInfo(
    rentcastOwner: any,
    thirdPartyProperty: ThirdPartyProperty,
  ): any {
    if (
      rentcastOwner &&
      rentcastOwner.names &&
      rentcastOwner.names.length > 0
    ) {
      return rentcastOwner; // Keep Rentcast owner info if it exists
    }

    // Use ThirdParty owner info if Rentcast is missing
    const ownerName =
      thirdPartyProperty.assesseeOrOwnerName ||
      thirdPartyProperty.currentOwnerName;
    if (!ownerName) return rentcastOwner;

    return {
      names: [ownerName],
      type: 'individual',
      mailingAddress: thirdPartyProperty.ownerAddress
        ? {
            id: '',
            formattedAddress: thirdPartyProperty.ownerAddress,
            addressLine1: thirdPartyProperty.ownerAddress,
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
          }
        : undefined,
    };
  }

  /**
   * Merge tax assessments, keeping Rentcast data as primary
   */
  private mergeTaxAssessments(
    rentcastTaxes: any,
    thirdPartyProperty: ThirdPartyProperty,
  ): any {
    if (rentcastTaxes && Object.keys(rentcastTaxes).length > 0) {
      return rentcastTaxes; // Keep Rentcast tax data if it exists
    }

    // Use ThirdParty tax data if Rentcast is missing
    if (
      !thirdPartyProperty.assessmentYear ||
      !thirdPartyProperty.totalAssessedValue
    ) {
      return rentcastTaxes;
    }

    return {
      [thirdPartyProperty.assessmentYear]: {
        year: thirdPartyProperty.assessmentYear,
        value: thirdPartyProperty.totalAssessedValue,
        land: thirdPartyProperty.assessedLandValue,
        improvements: thirdPartyProperty.assessedImprovementValue,
      },
    };
  }

  /**
   * Merge transaction history, keeping Rentcast data as primary
   */
  private mergeTransactionHistory(
    rentcastHistory: any,
    thirdPartyProperty: ThirdPartyProperty,
  ): any {
    if (rentcastHistory && Object.keys(rentcastHistory).length > 0) {
      return rentcastHistory; // Keep Rentcast history if it exists
    }

    // Build history from ThirdParty data if Rentcast is missing
    const history: any = {};

    if (thirdPartyProperty.latestSaleRecordingDate) {
      history[thirdPartyProperty.latestSaleRecordingDate] = {
        event: 'sale',
        date: thirdPartyProperty.latestSaleRecordingDate,
        price: thirdPartyProperty.salePriceFromTransaction,
      };
    }

    if (
      thirdPartyProperty.transactionSaleDate &&
      thirdPartyProperty.transactionSaleDate !==
        thirdPartyProperty.latestSaleRecordingDate
    ) {
      history[thirdPartyProperty.transactionSaleDate] = {
        event: 'transaction',
        date: thirdPartyProperty.transactionSaleDate,
        price: thirdPartyProperty.transactionSalePrice,
      };
    }

    if (thirdPartyProperty.priorSaleDate) {
      history[thirdPartyProperty.priorSaleDate] = {
        event: 'prior_sale',
        date: thirdPartyProperty.priorSaleDate,
      };
    }

    return Object.keys(history).length > 0 ? history : rentcastHistory;
  }
}
