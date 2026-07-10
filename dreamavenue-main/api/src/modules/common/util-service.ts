import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  async parse(address: string): Promise<any> {
    const trimmed = address.trim();
    let name = '';
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let state = '';
    let zip = '';
    let country = '';

    // First try comma-based parsing
    const parts = trimmed.split(',').map((p) => p.trim());

    if (parts.length === 4) {
      [streetName, city, state, zip] = parts;
    } else if (parts.length === 5) {
      [name, streetName, city, state, zip] = parts;
    } else if (parts.length === 6) {
      [name, streetName, city, state, zip, country] = parts;
    } else {
      // Try space-separated fallback
      const tokens = trimmed.split(/\s+/);

      if (tokens.length < 4) {
        throw new Error('Unrecognized address format: ' + address);
      }

      // Try pattern: <street number> <street name...> <city...> <state> <zip>
      const zipToken = tokens[tokens.length - 1];
      const stateToken = tokens[tokens.length - 2];
      const cityToken = tokens[tokens.length - 3];

      zip = zipToken;
      state = stateToken;
      city = cityToken;

      // The rest is the street
      const streetTokens = tokens.slice(0, tokens.length - 3);
      if (/^\d+$/.test(streetTokens[0])) {
        streetNumber = streetTokens[0];
        streetName = streetTokens.slice(1).join(' ');
      } else {
        streetName = streetTokens.join(' ');
      }

      return {
        name,
        streetNumber,
        streetName,
        city,
        state,
        zip,
        country,
        address,
      };
    }

    // Extract number from street name if not already parsed
    const streetMatch = streetName.match(/^(\d+)\s+(.*)$/);
    if (streetMatch) {
      streetNumber = streetMatch[1];
      streetName = streetMatch[2];
    }

    return {
      name,
      streetNumber,
      streetName,
      city,
      state,
      zip,
      country,
      address,
    };
  }

  async toFormattedAddress(address: string) {
    address = address.replace(', United States', '');
    address = address.replace('United States', '');
    const parsed = await this.parse(address);
    let formattedAddress = '';

    if (parsed['name']) {
      formattedAddress += parsed['name'];
      formattedAddress += ' ';
    }

    if (parsed['streetNumber']) {
      formattedAddress += parsed['streetNumber'];
      formattedAddress += ' ';
    }

    if (parsed['streetName']) {
      formattedAddress += parsed['streetName'];
      formattedAddress += ' ';
    }

    if (parsed['city']) {
      formattedAddress += parsed['city'];
      formattedAddress += ' ';
    }

    if (parsed['state']) {
      formattedAddress += parsed['state'];
      formattedAddress += ' ';
    }

    if (parsed['zip']) {
      formattedAddress += parsed['zip'];
      formattedAddress += ' ';
    }
    return formattedAddress.trim();
  }
}
