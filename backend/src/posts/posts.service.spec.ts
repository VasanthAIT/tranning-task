import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';

const mockPost = {
  title: 'Test Title',
  description: 'Test Description',
};

const mockPostArray = [mockPost];

describe('PostsService', () => {
  let service: PostsService;

  const mockPostModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPostArray),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Post'),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue(mockPost),
            })),
            mockPostModel,
          ),
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all posts', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockPostArray);
  });

  it('should return a post by ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockPost);
  });

  it('should create a post', async () => {
    const result = await service.create(mockPost);
    expect(result).toEqual(mockPost);
  });

  it('should delete a post', async () => {
    const result = await service.remove('1');
    expect(result).toEqual(mockPost);
  });
});
