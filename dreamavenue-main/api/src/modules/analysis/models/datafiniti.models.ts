interface DatafinitiRecord {
  address: string;
  city: string;
  country: string;
  county: string;
  dateAdded: string;
  dateUpdated: string;
  descriptions: Array<{
    dateSeen: string;
    value: string;
  }>;
  estimatedPrices: Array<{
    amountMax: number;
    amountMin: number;
    currency: string;
    dateSeen: string[];
    firstDateSeen: string;
    lastDateSeen: string;
    domains: string[];
    pricePerSquareFoot: number;
  }>;
  features: Array<{
    key: string;
    value: string[];
    replace?: string;
  }>;
  floorSizeValue: number;
  floorSizeUnit: string;
  geoLocation: string;
  latitude: string;
  longitude: string;
  legalDescription: string;
  lotSizeValue: number;
  lotSizeUnit: string;
  mostRecentPriceAmount: number;
  mostRecentPriceDomain: string;
  mostRecentPriceSourceURL: string;
  mostRecentPriceFirstDateSeen: string;
  mostRecentEstimatedPriceAmount: number;
  mostRecentEstimatedPriceDomain: string;
  mostRecentEstimatedPriceFirstDateSeen: string;
  mostRecentStatus: string;
  mostRecentStatusDate: string;
  mostRecentStatusFirstDateSeen: string;
  mlsNumber: string;
  neighborhoods: string[];
  numBathroom: number;
  numFloor: number;
  postalCode: string;
  propertyType: string;
  province: string;
  subdivision: string;
  statuses: Array<{
    date: string;
    dateSeen: string[];
    firstDateSeen: string;
    lastDateSeen: string;
    type: string;
  }>;
  yearBuilt: number;
  id: string;
}

interface DatafinitiResponse {
  num_found: number;
  total_cost: number;
  people_cost: number;
  property_cost: number;
  business_cost: number;
  records: DatafinitiRecord[];
}
