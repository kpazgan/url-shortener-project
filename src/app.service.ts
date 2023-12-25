import { Injectable } from '@nestjs/common';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
// import { LoggerService } from './core/logger/logger.service';

@Injectable()
export class AppService {
  // constructor(
  //   private readonly logger: LoggerService,
  //   @Inject(CACHE_MANAGER) private readonly cache: Cache,
  // ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
