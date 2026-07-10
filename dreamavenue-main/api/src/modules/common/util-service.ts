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
    const parts = trimmed
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (parts.length === 4) {
      [streetName, city, state, zip] = parts;
    } else if (parts.length === 5) {
      [name, streetName, city, state, zip] = parts;
    } else if (parts.length === 6) {
      [name, streetName, city, state, zip, country] = parts;
    } else if (parts.length >= 1 && parts.length <= 3) {
      // Partial input with no street address - e.g. just a city, "City, State",
      // or "State, Country". This is a normal, legitimate way to search (not
      // every search is for a specific street address), so make a best-effort
      // assignment instead of failing.
      const isCountryLike = (p: string) => /^(united states|usa|us)$/i.test(p);
      if (parts.length === 1) {
        city = parts[0];
      } else if (parts.length === 2) {
        if (isCountryLike(parts[1])) {
          [state, country] = parts;
        } else {
          [city, state] = parts;
        }
      } else {
        [city, state, country] = parts;
      }
    } else {
      // No commas at all (or a comma count we can't make sense of) - try a
      // space-separated fallback, e.g. "123 Main St Springfield IL 12345".
      const tokens = trimmed.split(/\s+/).filter((t) => t.length > 0);

      if (tokens.length === 0) {
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

      if (tokens.length < 4) {
        // Not enough tokens to confidently locate street/city/state/zip -
        // treat the whole input as a place name rather than failing outright.
        city = tokens.join(' ');
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
