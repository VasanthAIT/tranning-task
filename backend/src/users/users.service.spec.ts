import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    _id: '123',
    username: 'testuser',
    password: 'hashedpass',
    save: jest.fn().mockResolvedValue({
      _id: '123',
      username: 'testuser',
      password: 'hashedpass',
    }),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return a user if found', async () => {
      const expectedUser = { username: 'testuser', _id: '123' };
      (userModel.findOne as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(expectedUser),
      });

      const result = await service.findByUsername('testuser');
      expect(result).toEqual(expectedUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return null if user is not found', async () => {
      (userModel.findOne as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await service.findByUsername('nouser');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { username: 'newuser', password: 'secret' };
      const saveMock = jest.fn().mockResolvedValueOnce({
        _id: '123',
        username: 'newuser',
        password: 'secret',
      });

      const mockConstructor = jest.fn(() => ({
        save: saveMock,
      }));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getModelToken(User.name),
            useValue: mockConstructor,
          },
        ],
      }).compile();

      const userService = module.get<UsersService>(UsersService);
      const result = await userService.create(userData);

      expect(mockConstructor).toHaveBeenCalledWith(userData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({
        _id: '123',
        username: 'newuser',
        password: 'secret',
      });
    });
  });
});
