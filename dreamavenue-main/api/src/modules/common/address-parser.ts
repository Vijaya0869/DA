/**
 * USAddress TypeScript Library
 * A TypeScript port of the usaddress Python library for parsing unstructured
 * United States address strings into address components.
 */

// Address component types based on the United States Thoroughfare, Landmark, and Postal Address Data Standard
export type AddressComponentType =
  | 'AddressNumber'
  | 'AddressNumberPrefix'
  | 'AddressNumberSuffix'
  | 'BuildingName'
  | 'CornerOf'
  | 'IntersectionSeparator'
  | 'LandmarkName'
  | 'NotAddress'
  | 'OccupancyType'
  | 'OccupancyIdentifier'
  | 'PlaceName'
  | 'Recipient'
  | 'StateName'
  | 'StreetName'
  | 'StreetNamePreDirectional'
  | 'StreetNamePreModifier'
  | 'StreetNamePreType'
  | 'StreetNamePostDirectional'
  | 'StreetNamePostModifier'
  | 'StreetNamePostType'
  | 'SubaddressIdentifier'
  | 'SubaddressType'
  | 'USPSBoxGroupID'
  | 'USPSBoxGroupType'
  | 'USPSBoxID'
  | 'USPSBoxType'
  | 'ZipCode'
  | 'SecondStreetName';

export type AddressType =
  | 'Street Address'
  | 'Intersection'
  | 'PO Box'
  | 'Ambiguous';

export type ParsedComponent = [string, AddressComponentType];

export type TaggedAddress = {
  [key in AddressComponentType]?: string;
};

export class RepeatedLabelError extends Error {
  public originalString: string;
  public parsedString: ParsedComponent[];

  constructor(originalString: string, parsedString: ParsedComponent[]) {
    super(
      `Address has repeated labels and cannot be tagged unambiguously: ${originalString}`,
    );
    this.name = 'RepeatedLabelError';
    this.originalString = originalString;
    this.parsedString = parsedString;
  }
}

// Pattern dictionaries for address parsing
const PATTERNS = {
  // Directional words
  directionals: new Set([
    'north',
    'n',
    'south',
    's',
    'east',
    'e',
    'west',
    'w',
    'northeast',
    'ne',
    'northwest',
    'nw',
    'southeast',
    'se',
    'southwest',
    'sw',
  ]),

  // Street types that come after street name
  streetTypesPost: new Set([
    'street',
    'st',
    'avenue',
    'ave',
    'road',
    'rd',
    'drive',
    'dr',
    'lane',
    'ln',
    'boulevard',
    'blvd',
    'circle',
    'cir',
    'court',
    'ct',
    'place',
    'pl',
    'square',
    'sq',
    'trail',
    'trl',
    'parkway',
    'pkwy',
    'commons',
    'way',
    'alley',
    'plaza',
    'terrace',
    'ter',
    'highway',
    'hwy',
    'freeway',
    'fwy',
  ]),

  // Street types that come before street name
  streetTypesPre: new Set(['route', 'rt', 'highway', 'hwy', 'interstate', 'i']),

  // Occupancy types
  occupancyTypes: new Set([
    'apartment',
    'apt',
    'suite',
    'ste',
    'unit',
    'floor',
    'fl',
    'room',
    'rm',
    'building',
    'bldg',
    'tower',
    'level',
    'space',
    'office',
  ]),

  // USPS Box types
  uspsBoxTypes: new Set([
    'po box',
    'p.o. box',
    'p o box',
    'post office box',
    'box',
    'pox box',
  ]),

  // USPS Box Group types
  uspsBoxGroupTypes: new Set(['rr', 'rural route', 'hc', 'highway contract']),

  // Intersection separators
  intersectionSeparators: new Set([
    'and',
    '&',
    'at',
    '@',
    'corner of',
    'cor of',
    'intersection of',
  ]),

  // Corner indicators
  cornerOf: new Set([
    'corner of',
    'cor of',
    'junction',
    'jct',
    'intersection of',
  ]),

  // US States
  states: new Map([
    ['alabama', 'al'],
    ['alaska', 'ak'],
    ['arizona', 'az'],
    ['arkansas', 'ar'],
    ['california', 'ca'],
    ['colorado', 'co'],
    ['connecticut', 'ct'],
    ['delaware', 'de'],
    ['florida', 'fl'],
    ['georgia', 'ga'],
    ['hawaii', 'hi'],
    ['idaho', 'id'],
    ['illinois', 'il'],
    ['indiana', 'in'],
    ['iowa', 'ia'],
    ['kansas', 'ks'],
    ['kentucky', 'ky'],
    ['louisiana', 'la'],
    ['maine', 'me'],
    ['maryland', 'md'],
    ['massachusetts', 'ma'],
    ['michigan', 'mi'],
    ['minnesota', 'mn'],
    ['mississippi', 'ms'],
    ['missouri', 'mo'],
    ['montana', 'mt'],
    ['nebraska', 'ne'],
    ['nevada', 'nv'],
    ['new hampshire', 'nh'],
    ['new jersey', 'nj'],
    ['new mexico', 'nm'],
    ['new york', 'ny'],
    ['north carolina', 'nc'],
    ['north dakota', 'nd'],
    ['ohio', 'oh'],
    ['oklahoma', 'ok'],
    ['oregon', 'or'],
    ['pennsylvania', 'pa'],
    ['rhode island', 'ri'],
    ['south carolina', 'sc'],
    ['south dakota', 'sd'],
    ['tennessee', 'tn'],
    ['texas', 'tx'],
    ['utah', 'ut'],
    ['vermont', 'vt'],
    ['virginia', 'va'],
    ['washington', 'wa'],
    ['west virginia', 'wv'],
    ['wisconsin', 'wi'],
    ['wyoming', 'wy'],
    ['district of columbia', 'dc'],
  ]),
};

// Add reverse mapping for state abbreviations
const stateAbbreviations = new Set(Array.from(PATTERNS.states.values()));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
for (const [fullName, abbrev] of PATTERNS.states) {
  stateAbbreviations.add(abbrev.toUpperCase());
}

export class AddressParser {
  private tokenize(address: string): string[] {
    // Clean and tokenize the address string
    return address
      .replace(/[,;]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter((token) => token.length > 0);
  }

  private normalizeToken(token: string): string {
    return token.toLowerCase().replace(/[.,;]/g, '');
  }

  private isNumber(token: string): boolean {
    return /^\d+$/.test(token.replace(/[^\d]/g, ''));
  }

  private isZipCode(token: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(token);
  }

  private isState(token: string): boolean {
    const normalized = this.normalizeToken(token);
    return (
      PATTERNS.states.has(normalized) ||
      stateAbbreviations.has(normalized.toUpperCase())
    );
  }

  private classifyToken(
    token: string,
    position: number,
    tokens: string[],
  ): AddressComponentType {
    const normalized = this.normalizeToken(token);
    const prevToken =
      position > 0 ? this.normalizeToken(tokens[position - 1]) : '';
    const nextToken =
      position < tokens.length - 1
        ? this.normalizeToken(tokens[position + 1])
        : '';

    // Zip code check
    if (this.isZipCode(token)) {
      return 'ZipCode';
    }

    // State check
    if (this.isState(token)) {
      return 'StateName';
    }

    // USPS Box checks
    const twoTokenBox = `${normalized} ${nextToken}`.trim();
    if (
      PATTERNS.uspsBoxTypes.has(twoTokenBox) ||
      PATTERNS.uspsBoxTypes.has(normalized)
    ) {
      return 'USPSBoxType';
    }

    // Address number (usually at the beginning)
    if (position === 0 && this.isNumber(token)) {
      return 'AddressNumber';
    }

    // Occupancy identifier (number after occupancy type)
    if (this.isNumber(token) && PATTERNS.occupancyTypes.has(prevToken)) {
      return 'OccupancyIdentifier';
    }

    // Occupancy type
    if (PATTERNS.occupancyTypes.has(normalized)) {
      return 'OccupancyType';
    }

    // Directional checks
    if (PATTERNS.directionals.has(normalized)) {
      // Determine if pre or post directional based on context
      const hasStreetTypeBefore =
        position > 0 &&
        PATTERNS.streetTypesPost.has(this.normalizeToken(tokens[position - 1]));
      const hasStreetTypeAfter =
        position < tokens.length - 1 &&
        PATTERNS.streetTypesPost.has(this.normalizeToken(tokens[position + 1]));

      if (hasStreetTypeBefore || (position > 2 && !hasStreetTypeAfter)) {
        return 'StreetNamePostDirectional';
      }
      return 'StreetNamePreDirectional';
    }

    // Street type checks
    if (PATTERNS.streetTypesPost.has(normalized)) {
      return 'StreetNamePostType';
    }

    if (PATTERNS.streetTypesPre.has(normalized)) {
      return 'StreetNamePreType';
    }

    // Intersection separator
    if (PATTERNS.intersectionSeparators.has(normalized)) {
      return 'IntersectionSeparator';
    }

    // Corner indicators
    if (PATTERNS.cornerOf.has(normalized)) {
      return 'CornerOf';
    }

    // USPS Box ID (number after box type)
    if (this.isNumber(token) && PATTERNS.uspsBoxTypes.has(prevToken)) {
      return 'USPSBoxID';
    }

    // Default classifications based on position and context
    if (this.isNumber(token)) {
      return 'AddressNumber';
    }

    // If it's after a street name and before city/state, likely part of street
    const hasAddressNumber = tokens.some(
      (t, i) => i < position && this.isNumber(t),
    );
    const hasStateAfter = tokens.some(
      (t, i) => i > position && this.isState(t),
    );

    if (hasAddressNumber && hasStateAfter) {
      // Could be street name or place name
      const hasStreetType = tokens.some(
        (t, i) =>
          i > position - 2 &&
          i < position + 3 &&
          (PATTERNS.streetTypesPost.has(this.normalizeToken(t)) ||
            PATTERNS.streetTypesPre.has(this.normalizeToken(t))),
      );

      if (hasStreetType) {
        return 'StreetName';
      }

      // Check if it's likely a place name (closer to state)
      const statePosition = tokens.findIndex(
        (t, i) => i > position && this.isState(t),
      );
      if (statePosition !== -1 && statePosition - position <= 2) {
        return 'PlaceName';
      }

      return 'StreetName';
    }

    // Default to street name for most unclassified tokens
    return 'StreetName';
  }

  public parse(address: string): ParsedComponent[] {
    const tokens = this.tokenize(address);
    const result: ParsedComponent[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const classification = this.classifyToken(token, i, tokens);
      result.push([token, classification]);
    }

    return this.postProcessParse(result);
  }

  private postProcessParse(parsed: ParsedComponent[]): ParsedComponent[] {
    // Post-processing to improve classification accuracy
    const result = [...parsed];

    // Fix street names that might be misclassified as place names
    for (let i = 0; i < result.length - 1; i++) {
      const [token, type] = result[i];
      const [nextToken, nextType] = result[i + 1];

      // If we have a street type after what we classified as PlaceName, it's probably StreetName
      if (
        type === 'PlaceName' &&
        (nextType === 'StreetNamePostType' ||
          nextType === 'StreetNamePostDirectional')
      ) {
        result[i] = [token, 'StreetName'];
      }
    }

    // Handle intersection case - if we have intersection separator, classify nearby street names
    const hasIntersectionSeparator = result.some(
      ([, type]) => type === 'IntersectionSeparator',
    );
    if (hasIntersectionSeparator) {
      const separatorIndex = result.findIndex(
        ([, type]) => type === 'IntersectionSeparator',
      );
      // Classify tokens after separator as SecondStreetName if they look like street names
      for (let i = separatorIndex + 1; i < result.length; i++) {
        const [token, type] = result[i];
        if (type === 'StreetName' || type === 'PlaceName') {
          // Check if this is before state/place name
          const hasStateAfter = result
            .slice(i + 1)
            .some(([, t]) => t === 'StateName' || t === 'PlaceName');
          if (
            !hasStateAfter ||
            result.slice(i + 1).some(([, t]) => t === 'StreetNamePostType')
          ) {
            result[i] = [token, 'SecondStreetName'];
          } else {
            break; // Reached place name section
          }
        } else if (type === 'StateName' || type === 'ZipCode') {
          break;
        }
      }
    }

    return result;
  }

  public tag(
    address: string,
    tagMapping?: Record<string, string>,
  ): [TaggedAddress, AddressType] {
    const parsed = this.parse(address);
    const tagged: TaggedAddress = {};
    const labelCounts: Record<string, number> = {};

    // Count occurrences of each label
    for (const [, label] of parsed) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }

    // Check for repeated labels that can't be merged
    const problematicLabels = Object.entries(labelCounts)
      .filter(
        ([label, count]) =>
          count > 1 && !this.canMergeLabel(label as AddressComponentType),
      )
      .map(([label]) => label);

    if (problematicLabels.length > 0) {
      throw new RepeatedLabelError(address, parsed);
    }

    // Group consecutive tokens with same label
    let currentLabel: AddressComponentType | null = null;
    let currentTokens: string[] = [];

    const flushCurrent = () => {
      if (currentLabel && currentTokens.length > 0) {
        const finalLabel = tagMapping
          ? tagMapping[currentLabel] || currentLabel
          : currentLabel;
        const value = currentTokens.join(' ').replace(/,$/, ''); // Remove trailing comma

        if (tagged[finalLabel as keyof TaggedAddress]) {
          tagged[finalLabel as keyof TaggedAddress] += ' ' + value;
        } else {
          tagged[finalLabel as keyof TaggedAddress] = value;
        }
      }
      currentTokens = [];
    };

    for (const [token, label] of parsed) {
      if (label !== currentLabel) {
        flushCurrent();
        currentLabel = label;
      }
      currentTokens.push(token);
    }
    flushCurrent();

    // Determine address type
    const addressType = this.determineAddressType(parsed);

    return [tagged, addressType];
  }

  private canMergeLabel(label: AddressComponentType): boolean {
    // Labels that can have multiple consecutive tokens merged
    return [
      'StreetName',
      'PlaceName',
      'BuildingName',
      'LandmarkName',
      'Recipient',
      'SecondStreetName',
    ].includes(label);
  }

  private determineAddressType(parsed: ParsedComponent[]): AddressType {
    const hasIntersectionSeparator = parsed.some(
      ([, type]) => type === 'IntersectionSeparator',
    );
    const hasSecondStreetName = parsed.some(
      ([, type]) => type === 'SecondStreetName',
    );
    const hasUSPSBox = parsed.some(([, type]) => type === 'USPSBoxType');
    const hasAddressNumber = parsed.some(
      ([, type]) => type === 'AddressNumber',
    );
    const hasStreetName = parsed.some(([, type]) => type === 'StreetName');

    if (hasUSPSBox) {
      return 'PO Box';
    }

    if (hasIntersectionSeparator || hasSecondStreetName) {
      return 'Intersection';
    }

    if (hasAddressNumber && hasStreetName) {
      return 'Street Address';
    }

    return 'Ambiguous';
  }

  toStandardAddress(address: string) {
    const parsed = this.convertToAddressObject(this.parse(address));
    let formattedAddress = '';
    if (parsed['AddressNumber']) {
      formattedAddress += parsed['AddressNumber'];
      formattedAddress += ' ';
    }

    if (parsed['StreetName']) {
      formattedAddress += parsed['StreetName'];
      formattedAddress += ' ';
    }

    if (parsed['StreetNamePostType']) {
      formattedAddress += parsed['StreetNamePostType'];
      formattedAddress += ' ';
    }

    if (parsed['SecondStreetName']) {
      formattedAddress += parsed['SecondStreetName'];
      formattedAddress += ' ';
    }

    if (parsed['PlaceName']) {
      formattedAddress += parsed['PlaceName'];
      formattedAddress += ' ';
    }
    return formattedAddress.trim();
  }

  convertToAddressObject(pairs: [string, string][]): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [value, label] of pairs) {
      // If label already exists, append to the value with space
      if (result[label]) {
        result[label] += ' ' + value;
      } else {
        result[label] = value;
      }
    }

    return result;
  }
}
