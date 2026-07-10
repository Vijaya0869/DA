import * as hbs from 'handlebars';
import { FormatHelper } from './format.helper';

export class HandlebarsFormatHelper {
  private formatHelper: FormatHelper;

  constructor() {
    this.formatHelper = new FormatHelper();
    this.registerHelpers();
  }

  private registerHelpers() {
    //json converter
    hbs.registerHelper('json', (context: any, options?: any) => {
      return JSON.stringify(context);
    });

    // Format Number Helper
    hbs.registerHelper('formatNumber', (value: number, options?: any) => {
      const opts = options?.hash || {};
      return this.formatHelper.formatNumber(value, {
        locale: opts.locale,
        minimumFractionDigits: opts.minDecimals,
        maximumFractionDigits: opts.maxDecimals,
        useGrouping: opts.useGrouping !== false,
      });
    });

    // Format Date Helper
    hbs.registerHelper(
      'formatDate',
      (value: Date | string | number, options?: any) => {
        const opts = options?.hash || {};
        return this.formatHelper.formatDate(value, {
          locale: opts.locale,
          timeZone: opts.timeZone,
          dateStyle: opts.dateStyle,
          timeStyle: opts.timeStyle,
          year: opts.year,
          month: opts.month,
          day: opts.day,
        });
      },
    );

    // Format Decimal Helper
    hbs.registerHelper('formatDecimal', (value: number, options?: any) => {
      const opts = options?.hash || {};
      return this.formatHelper.formatDecimal(value, {
        locale: opts.locale,
        minimumFractionDigits: opts.minDecimals || 2,
        maximumFractionDigits: opts.maxDecimals || 2,
      });
    });

    // Format Currency Helper
    hbs.registerHelper('formatCurrency', (value: number, options?: any) => {
      const opts = options?.hash || {};
      return this.formatHelper.formatCurrency(
        value,
        opts.currency || 'USD',
        opts.locale || 'en-US',
      );
    });

    // Format Percentage Helper
    hbs.registerHelper('formatPercentage', (value: number, options?: any) => {
      const opts = options?.hash || {};
      return this.formatHelper.formatPercentage(
        value,
        opts.locale || 'en-US',
        opts.decimals || 1,
      );
    });

    // Format File Size Helper
    hbs.registerHelper('formatFileSize', (value: number, options?: any) => {
      const opts = options?.hash || {};
      return this.formatHelper.formatFileSize(value, opts.locale || 'en-US');
    });

    // Format Duration Helper
    hbs.registerHelper('formatDuration', (value: number) => {
      return this.formatHelper.formatDuration(value);
    });

    // Format Phone Helper
    hbs.registerHelper('formatPhone', (value: string) => {
      return this.formatHelper.formatPhoneNumber(value);
    });
  }
}
