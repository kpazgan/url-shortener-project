import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>;
  const apiKey = `apiKey`;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValueOnce(apiKey);
    authGuard = new AuthGuard(configService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  // happy path: valid api key
  it('should return true if api key is valid', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': apiKey,
          },
        }),
      }),
    });
    const result = authGuard.canActivate(mockedExecutionContext);

    expect(result).toBe(true);
  });
  // unhappy path: no api key passed
  it('should return error when API header does not exists', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });
    const result = () => authGuard.canActivate(mockedExecutionContext);

    expect(result).toThrow(UnauthorizedException);
  });
  // unhappy path: invalid api key passed
  it('should return error when API key is invalid', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'invalid-key',
          },
        }),
      }),
    });
    const result = () => authGuard.canActivate(mockedExecutionContext);

    expect(result).toThrow(UnauthorizedException);
  });
});
