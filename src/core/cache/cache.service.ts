import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return await this.cache.set(key, value, { ttl } as any);
  }

  async del(key: string): Promise<void> {
    return await this.cache.del(key);
  }

  async reset(): Promise<void> {
    return await this.cache.reset();
  }

  async onModuleDestroy() {
    const redisClient = (this.cache.store as any).getClient();
    redisClient.quit();
  }
}
