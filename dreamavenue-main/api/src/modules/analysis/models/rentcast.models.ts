interface RentcastProperty {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms?: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  assessorID?: string;
  legalDescription: string;
  subdivision: string;
  zoning?: string;
  lastSaleDate?: string;
  lastSalePrice?: number;
  hoa?: {
    fee: number;
  };
  features: {
    architectureType?: string;
    cooling?: boolean;
    coolingType?: string;
    exteriorType?: string;
    fireplace?: boolean;
    fireplaceType?: string;
    floorCount?: number;
    foundationType?: string;
    garage?: boolean;
    garageSpaces?: number;
    garageType?: string;
    heating?: boolean;
    heatingType?: string;
    pool?: boolean;
    poolType?: string;
    roofType?: string;
    roomCount?: number;
    unitCount?: number;
    viewType?: string;
    // Additional fields from Datafiniti
    constructionType?: string;
    buildingType?: string;
    roofShape?: string;
    stories?: number;
    storiesType?: string;
  };
  taxAssessments?: {
    [year: string]: {
      year: number;
      value: number;
      land?: number;
      improvements?: number;
    };
  };
  propertyTaxes?: {
    [year: string]: {
      year: number;
      total: number;
    };
  };
  history?: {
    [date: string]: {
      event: string;
      date: string;
      price?: number;
    };
  };
  owner?: {
    names: string[];
    type: string;
    mailingAddress?: {
      id: string;
      formattedAddress: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  ownerOccupied?: boolean;
  additional?: {
    dateAdded?: string;
    dateUpdated?: string;
    descriptions?: Array<{
      dateSeen: string;
      value: string;
    }>;
    estimatedPrices?: Array<{
      amountMax: number;
      amountMin: number;
      currency: string;
      dateSeen: string[];
      pricePerSquareFoot: number;
    }>;
    mlsNumber?: string;
    neighborhoods?: string[];
    recentStatus?: string;
    recentStatusDate?: string;
    transportScores?: {
      biking?: string;
      walking?: string;
      transit?: string;
    };
    marketStats?: {
      avgOffers?: number;
      avgDownPayment?: string;
      medianSaleToList?: string;
      soldHomes?: number;
      medianListPrice?: string;
      medianPricePerSqFt?: string;
    };
    nearbyHomes?: {
      recentlySold?: string[];
      similar?: string[];
    };
    priceHistory?: Array<{
      date: string;
      price: string;
      event: string;
    }>;
  };
}
interface EnhancedRentcastProperty extends RentcastProperty {
  // Assessment and valuation data
  assessedLandValue?: number;
  assessedImprovementValue?: number;
  totalAssessedValue?: number;
  totalMarketValue?: number;
  marketValueLand?: number;
  totalAssessedValuePerSQFT?: number;
  totalMarketValuePerSQFT?: number;

  // Property classification
  category?: string;
  subcategory?: string;
  propertyGrade?: string;
  buildingClass?: string;

  // Building details
  numberofUnits?: number;
  noofBuildings?: number;
  noofStories?: string;
  actualOccupancy?: number;

  // Financial data
  potentialGrossIncome?: number;
  vacancy?: number;
  effectiveGrossIncome?: number;
  expenses?: number;
  nOI?: number; // Net Operating Income

  // Mortgage information
  priorMortgageAmount?: number;
  priorMortgageDate?: string;
  priorMortgagePricePerSqFt?: number;
  priorMortgageYear?: number;

  // Transaction details
  adjustedPSF?: number;
  transactionGBA?: number; // Gross Building Area
  transactionLotSize?: number;
  transactionSalePricePerSqFt?: number;

  // Additional metadata
  assessmentYear?: number;
  yearRenovated?: number;
  signatureDate?: string;
  multipleproperty?: boolean;
  detailPageURL?: string;
  imageURL?: string;

  // Geographic data
  fips?: number;
  censusTract?: string;
  frontage?: number;
  distance?: number;
  milesFromSubject?: number;

  // Buyer/Seller information
  buyerName?: string;
  sellerName?: string;
  buyerCompany?: string;
  sellerCompany?: string;
  buyerAddress?: string;
  sellerAddress?: string;
  buyerPhoneNumber?: string;
  sellerPhoneNumber?: string;
  buyerEmail?: string;
  sellerEmail?: string;

  // SEO metadata
  metaDescription?: string;
  metaKeyWords?: string;
  metaURL?: string;

  // Additional property details
  parcelID?: any;
  taxAccountNumber?: any;
  staticMapURL?: any;
  filmcode?: any;
  transactionSalePriceRangeFrom?: number;
  transactionSalePriceRangeTo?: number;
  transactionSalePricePSFRangeFrom?: number;
  transactionSalePricePSFRangeTo?: number;
  transactionbuyerEntityName?: any;
  transactionsellerEntityName?: any;
  transactionbuyerName?: any;
  es_Flag?: boolean;
  debugvalue?: any;
  nra?: number;
}
