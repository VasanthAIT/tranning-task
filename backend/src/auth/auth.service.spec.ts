import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: JwtService;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mocked_token') },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw BadRequestException if username already exists', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce({ username: 'test' });

      await expect(
        authService.register({ username: 'test', password: 'password' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return access_token if registration is successful', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce(null);
      (usersService.create as jest.Mock).mockResolvedValueOnce({
        _id: '123',
        username: 'test',
      });

      // ✅ Type assertion fix
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve('hashedPassword') as any);

      const result = await authService.register({ username: 'test', password: 'password' });

      expect(result).toEqual({
        access_token: 'mocked_token',
        user: {
          _id: '123',
          username: 'test',
        },
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if credentials are invalid', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        authService.login({ username: 'test', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token if credentials are valid', async () => {
      const mockUser = {
        _id: '123',
        username: 'test',
        password: 'hashedPassword',
      };
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce(mockUser);

      // ✅ Type assertion fix
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true) as any);

      const result = await authService.login({ username: 'test', password: 'password' });

      expect(result).toEqual({
        access_token: 'mocked_token',
        user: {
          _id: '123',
          username: 'test',
        },
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        _id: '123',
        username: 'test',
        password: 'hashedPassword',
      };
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true) as any);

      const result = await authService.validateUser('test', 'password');
      expect(result).toEqual({ _id: '123', username: 'test' });
    });

    it('should return null if password does not match', async () => {
      const mockUser = {
        _id: '123',
        username: 'test',
        password: 'hashedPassword',
      };
      (usersService.findByUsername as jest.Mock).mockResolvedValueOnce(mockUser);

      // ✅ Type assertion fix
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false) as any);

      const result = await authService.validateUser('test', 'wrong');
      expect(result).toBeNull();
    });
  });
});
