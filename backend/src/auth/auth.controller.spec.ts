import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register and return result', async () => {
      const dto = { username: 'test', password: 'pass' };
      const mockResult = { access_token: 'token', user: { username: 'test' } };

      mockAuthService.register.mockResolvedValueOnce(mockResult);

      const result = await controller.register(dto);
      expect(result).toEqual(mockResult);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if validateUser fails', async () => {
      const dto = { username: 'test', password: 'wrong' };
      mockAuthService.validateUser.mockResolvedValueOnce(null);

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token if credentials are valid', async () => {
      const dto = { username: 'test', password: 'pass' };
      const mockUser = { username: 'test' };
      const mockToken = { access_token: 'mock_token', user: mockUser };

      mockAuthService.validateUser.mockResolvedValueOnce(mockUser);
      mockAuthService.login.mockResolvedValueOnce(mockToken);

      const result = await controller.login(dto);
      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith('test', 'pass');
      expect(authService.login).toHaveBeenCalledWith({ username: 'test', password: 'pass' });
    });
  });
});
