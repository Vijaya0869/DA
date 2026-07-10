import { IBlobStorage } from '../interfaces/blob-storage.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileBlobService implements IBlobStorage {
  private readonly basePath: string;

  constructor() {
    this.basePath = process.env.FILE_STORAGE_PATH || 'storage';
  }

  async upload(
    file: Buffer,
    filePath: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file);

    if (metadata) {
      await fs.writeFile(`${fullPath}.meta`, JSON.stringify(metadata), 'utf-8');
    }

    return filePath;
  }

  async download(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.basePath, filePath);
      await fs.unlink(fullPath);
      await fs.unlink(`${fullPath}.meta`).catch(() => {});
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.basePath, filePath));
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(filePath: string): Promise<Record<string, any>> {
    try {
      const metaPath = path.join(this.basePath, `${filePath}.meta`);
      const data = await fs.readFile(metaPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
}
