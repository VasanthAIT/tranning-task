// src/posts/posts.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost: PostModel = {
    _id: '1',
    title: 'Test Post',
    content: 'Test content',
  } as PostModel;

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(mockPost),
    consoleLog: jest.fn().mockResolvedValue('Console logged'),
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue({ ...mockPost, title: 'Updated Title' }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const result = await controller.create({ title: 'Test', content: 'Content' });
      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledWith({ title: 'Test', content: 'Content' });
    });
  });

  describe('findConsole', () => {
    it('should return console log response', async () => {
      const result = await controller.findConsole();
      expect(result).toBe('Console logged');
      expect(service.consoleLog).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockPost]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one post', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const result = await controller.update('1', { title: 'Updated Title' });
      expect(result).toEqual({ ...mockPost, title: 'Updated Title' });
      expect(service.update).toHaveBeenCalledWith('1', { title: 'Updated Title' });
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
