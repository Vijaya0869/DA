import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class StaticService {
  constructor() {}

  async getPropertyColumnsForImport() {
    const filePath = path.join(
      __dirname,
      '../..',
      'public',
      `property_columns.json`
    );
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
}
