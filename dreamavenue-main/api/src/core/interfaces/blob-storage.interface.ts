export interface IBlobStorage {
  upload(file: Buffer, path: string, metadata?: Record<string, any>): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<boolean>;
  exists(path: string): Promise<boolean>;
  getMetadata(path: string): Promise<Record<string, any>>;
}