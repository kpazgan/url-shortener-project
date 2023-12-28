import { ConfigService } from '@nestjs/config';
import { app } from '../../../test/setup';
import { DatabaseService } from '../../database/database.service';
import { createManyUrls } from './__tests__/test-utils';
import { UrlService } from './url.service';

describe(`UrlService Integration Tests`, () => {
  let urlService: UrlService;
  let databaseService: DatabaseService;
  let configService: ConfigService;
  let host: string;

  beforeAll(async () => {
    databaseService = app.get(DatabaseService);
    urlService = app.get(UrlService);
    configService = app.get(ConfigService);
    host = configService.getOrThrow(`host`);
  });

  describe(`create`, () => {
    it(`should persist and return the url`, async () => {
      const payload = {
        title: `My special link`,
        redirect: `https://konradpazgan.pl`,
      };

      const url = await urlService.create(payload);
      const persistedUrl = await databaseService.url.findUnique({
        where: {
          url: url.url,
        },
      });

      expect(url).toEqual(persistedUrl);
    });
  });

  describe('findAll', () => {
    it(`should return empty array when no urls are in database`, async () => {
      const response = await urlService.findAll({});

      expect(response.data).toEqual([]);
    });

    it(`should return array of persisted urls`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const urls = await databaseService.url.findMany({});

      const response = await urlService.findAll({});

      expect(response.data).toEqual(urls);
    });

    it(`should paginate results and show middle page`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const totalCount = await databaseService.url.count();
      const limit = 1;
      const page = 2;

      const response = await urlService.findAll({ page, limit });

      expect(response.meta).toEqual({
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it(`should paginate results and show last page`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const totalCount = await databaseService.url.count();
      const limit = 1;
      const page = 3;

      const response = await urlService.findAll({ page, limit });

      expect(response.meta).toEqual({
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        hasNextPage: false,
        hasPrevPage: true,
      });
    });
  });

  describe(`findOne`, () => {
    it(`should return null when url does not exists`, async () => {
      const url = await urlService.findOne(`non-existing-url`);

      expect(url).toBeNull();
    });

    it(`should return respective url when url exists`, async () => {
      const uid = `123456`;
      const persistedUrl = await databaseService.url.create({
        data: {
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/${uid}`,
        },
      });
      const url = await urlService.findOne(uid);

      expect(url).toEqual(persistedUrl);
    });
  });

  describe(`update`, () => {
    it(`should update and return updated record`, async () => {
      await databaseService.url.create({
        data: {
          id: 1,
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/123456`,
        },
      });

      const url = await urlService.update(1, { title: `Updated title` });
      const updatedPersistedUrl = await databaseService.url.findUnique({
        where: { id: 1 },
      });

      expect(url).toEqual(updatedPersistedUrl);
    });

    it(`should throw an error when url does not exists`, async () => {
      const updatedUrl = urlService.update(1, { title: 'Updated title' });

      await expect(updatedUrl).rejects.toThrow();
    });
  });

  describe(`remove`, () => {
    it(`should remove and return respective url if exists`, async () => {
      const persistedUrl = await databaseService.url.create({
        data: {
          id: 1,
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/123456`,
        },
      });

      const url = await urlService.remove(1);
      const removedUrl = await databaseService.url.findUnique({
        where: { id: 1 },
      });

      expect(persistedUrl).toEqual(url);
      expect(removedUrl).toBeNull();
    });

    it(`should return error when url does not exists`, async () => {
      const removedUrl = urlService.remove(1);

      await expect(removedUrl).rejects.toThrow();
    });
  });
});
