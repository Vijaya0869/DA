// stringUtils.ts (or stringUtils.js)

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  export const toCamelCase = (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => 
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '');
  };
  
  export const truncateString = (str: string, length: number): string => {
    if (!str || str.length <= length) return str;
    return `${str.substring(0, length)}...`;
  };
  
  export const isEmptyOrNull = (str: string | null | undefined): boolean => {
    return !str || str.trim().length === 0;
  };
  
  export const reverseString = (str: string): string => {
    return str.split('').reverse().join('');
  };
  
  export const removeSpecialCharacters = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
  };
  
  export const toKebabCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  };
  
  export const toSnakeCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };
  
  export const countWords = (str: string): number => {
    return str.trim().split(/\s+/).length;
  };
  
  export const containsSubstring = (str: string, substring: string): boolean => {
    return str.indexOf(substring) !== -1;
  };
  
  export const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  export const compareStringsIgnoreCase = (str1: string, str2: string): boolean => {
    return str1.toLowerCase() === str2.toLowerCase();
  };
  