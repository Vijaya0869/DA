import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  // Use singular and camelCase for table names
  tableName(className: string, customName: string): string {
    return customName
      ? customName
      : className.charAt(0).toLowerCase() + className.slice(1);
  }

  // Use camelCase for column names
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return customName ? customName : propertyName;
  }

  // Use camelCase for relation names
  relationName(propertyName: string): string {
    return propertyName;
  }
}
