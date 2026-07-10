// src/common/helpers/format.helper.ts
import { Injectable } from '@nestjs/common';

export interface NumberFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}

export interface DecimalFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currency?: string;
  style?: 'decimal' | 'currency' | 'percent';
}

@Injectable()
export class FormatHelper {
  /**
   * Format a number with locale-specific formatting
   * @param value - The number to format
   * @param options - Formatting options
   * @returns Formatted number string
   */
  formatNumber(value: number, options: NumberFormatOptions = {}): string {
    const {
      locale = 'en-US',
      minimumFractionDigits = 0,
      maximumFractionDigits = 3,
      useGrouping = true,
    } = options;

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
      }).format(value);
    } catch (error) {
      console.error('Error formatting number:', error);
      return value.toString();
    }
  }

  /**
   * Format a date with locale-specific formatting
   * @param value - The date to format (Date object, string, or timestamp)
   * @param options - Formatting options
   * @returns Formatted date string
   */
  formatDate(
    value: Date | string | number,
    options: DateFormatOptions = {},
  ): string {
    const { locale = 'en-US', timeZone = 'UTC', ...formatOptions } = options;

    if (!value) {
      return '';
    }
    try {
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date value');
      }

      // Default format if no specific options provided
      const defaultOptions =
        Object.keys(formatOptions).length === 0
          ? { dateStyle: 'medium' as const, timeStyle: 'short' as const }
          : formatOptions;

      return new Intl.DateTimeFormat(locale, {
        timeZone,
        ...defaultOptions,
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  /**
   * Format a decimal number with specific precision and locale
   * @param value - The decimal number to format
   * @param options - Formatting options
   * @returns Formatted decimal string
   */
  formatDecimal(value: number, options: DecimalFormatOptions = {}): string {
    const {
      locale = 'en-US',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      currency = 'USD',
      style = 'decimal',
    } = options;

    try {
      const formatOptions: Intl.NumberFormatOptions = {
        style,
        minimumFractionDigits,
        maximumFractionDigits,
      };

      if (style === 'currency') {
        formatOptions.currency = currency;
      }

      return new Intl.NumberFormat(locale, formatOptions).format(value);
    } catch (error) {
      console.error('Error formatting decimal:', error);
      return value.toFixed(maximumFractionDigits);
    }
  }

  /**
   * Format a number as currency
   * @param value - The number to format as currency
   * @param currency - Currency code (e.g., 'USD', 'EUR', 'GBP')
   * @param locale - Locale for formatting
   * @returns Formatted currency string
   */
  formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
    return this.formatDecimal(value, {
      locale,
      currency,
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Format a number as percentage
   * @param value - The decimal value to format as percentage (0.15 = 15%)
   * @param locale - Locale for formatting
   * @param decimals - Number of decimal places
   * @returns Formatted percentage string
   */
  formatPercentage(value: number, locale = 'en-US', decimals = 1): string {
    return this.formatDecimal(value, {
      locale,
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Format file size in human-readable format
   * @param bytes - Size in bytes
   * @param locale - Locale for formatting
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number, locale = 'en-US'): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const formattedSize = this.formatDecimal(size, {
      locale,
      minimumFractionDigits: unitIndex === 0 ? 0 : 1,
      maximumFractionDigits: unitIndex === 0 ? 0 : 2,
    });

    return `${formattedSize} ${units[unitIndex]}`;
  }

  /**
   * Format duration in milliseconds to human-readable format
   * @param milliseconds - Duration in milliseconds
   * @returns Formatted duration string
   */
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Format a phone number (US format)
   * @param phoneNumber - Raw phone number string
   * @returns Formatted phone number
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return phoneNumber; // Return original if format not recognized
  }
}
