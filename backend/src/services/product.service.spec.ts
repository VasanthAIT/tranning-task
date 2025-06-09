import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product } from '../schemas/product.schema';
import { InternalServerErrorException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let mockModel: any;

  const mockProduct = {
    _id: '123',
    name: 'Sample Product',
    price: 100,
    stock: 10,
    createdAt: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      mockModel.find.mockReturnValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(mockModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one product by id', async () => {
      mockModel.findById.mockResolvedValue(mockProduct);

      const result = await service.findOne('123');
      expect(result).toEqual(mockProduct);
      expect(mockModel.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('remove', () => {
    it('should delete one product by id', async () => {
      mockModel.findByIdAndDelete.mockResolvedValue(mockProduct);

      const result = await service.remove('123');
      expect(result).toEqual(mockProduct);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update product by id', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Name' };
      mockModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      const result = await service.update(
        '123',
        { name: 'Updated Name' } as any,
        'img.jpg',
        ['gallery1.jpg'],
      );

      expect(result).toEqual(updatedProduct);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'Updated Name', image: 'img.jpg', gallery: ['gallery1.jpg'] },
        { new: true },
      );
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'New Product', price: 99, stock: 5 };

      const saveMock = jest.fn().mockResolvedValue(mockProduct);
      const productModelMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      // Override productModel constructor for test
      (service as any).productModel = productModelMock;

      const result = await service.create(dto as any, 'img.jpg', ['img1.jpg']);
      expect(productModelMock).toHaveBeenCalledWith({
        ...dto,
        image: 'img.jpg',
        gallery: ['img1.jpg'],
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('filterProducts', () => {
    it('should return filtered products by name', async () => {
      const filter = { name: 'shirt' } as any;
      const filtered = [mockProduct];
      mockModel.find.mockReturnValue(filtered);

      const result = await service.filterProducts(filter);
      expect(result).toEqual(filtered);
      expect(mockModel.find).toHaveBeenCalledWith({
        name: { $regex: 'shirt', $options: 'i' },
      });
    });

    it('should return filtered products by price and stock', async () => {
      const filter = { minPrice: 50, maxPrice: 200, stock: 10 } as any;
      const filtered = [mockProduct];
      mockModel.find.mockReturnValue(filtered);

      const result = await service.filterProducts(filter);
      expect(mockModel.find).toHaveBeenCalledWith({
        price: { $gte: 50, $lte: 200 },
        stock: 10,
      });
      expect(result).toEqual(filtered);
    });

    it('should throw InternalServerErrorException on filter error', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockModel.find.mockImplementationOnce(() => {
        throw new Error('MongoDB error');
      });

      await expect(service.filterProducts({ name: 'error' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );

      errorSpy.mockRestore();
    });
  });
});
