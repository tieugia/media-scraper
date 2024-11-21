export interface ICacheService {
  delete(keysIncluded: string): Promise<void>;
  set(key: string, value: any, ttl: number): Promise<void>;
  get(key: string): Promise<any | null>;
}