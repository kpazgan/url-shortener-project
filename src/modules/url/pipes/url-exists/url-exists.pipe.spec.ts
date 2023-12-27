import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UrlExistsPipe } from './url-exists.pipe';
import { UrlService } from '../../url.service';
import { Test, TestingModule } from '@nestjs/testing';
import { generateUrlPayload, uid } from '../../__tests__/test-utils';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlExistsPipe: UrlExistsPipe;
  let urlService: DeepMocked<UrlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UrlService,
          useValue: createMock<UrlService>(),
        },
      ],
    }).compile();

    urlService = module.get(UrlService);
    urlExistsPipe = new UrlExistsPipe(urlService);
  });

  it(`should return the URL when it exists`, async () => {
    const payload = generateUrlPayload({});
    urlService.findOne.mockResolvedValueOnce(payload);

    const result = await urlExistsPipe.transform(uid);

    expect(result).toEqual(payload);
  });

  it(`should throw NotFoundException when the URL does not exist`, async () => {
    urlService.findOne.mockResolvedValueOnce(null);

    const result = urlExistsPipe.transform(`invalid random url`);

    expect(result).rejects.toThrow(NotFoundException);
  });

  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });
});
