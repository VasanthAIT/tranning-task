import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto } from '../dtos/filter-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    filterProducts: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('filterProducts', () => {
    it('should call service with correct filter', async () => {
      const dto: FilterProductDto = { name: 'test' };
      const expected = [{ name: 'test' }];
      mockProductService.filterProducts.mockResolvedValue(expected);

      const result = await controller.filterProducts(dto);
      expect(service.filterProducts).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('createSingleImage', () => {
    it('should create product with single image', async () => {
      const dto: CreateProductDto = { name: 'product', price: 10, stock: 5 };
      const file = { filename: 'image.jpg' } as Express.Multer.File;
      const expected = { ...dto, image: file.filename };
      mockProductService.create.mockResolvedValue(expected);

      const result = await controller.createSingleImage(file, dto);
      expect(service.create).toHaveBeenCalledWith(dto, file.filename);
      expect(result).toEqual(expected);
    });
  });

  describe('createMultipleImages', () => {
    it('should create product with multiple images', async () => {
      const dto: CreateProductDto = { name: 'multi', price: 100, stock: 2 };
      const files = [
        { filename: 'img1.jpg' },
        { filename: 'img2.jpg' },
      ] as Express.Multer.File[];

      const expected = { ...dto, gallery: ['img1.jpg', 'img2.jpg'] };
      mockProductService.create.mockResolvedValue(expected);

      const result = await controller.createMultipleImages(files, dto);
      expect(service.create).toHaveBeenCalledWith(dto, undefined, ['img1.jpg', 'img2.jpg']);
      expect(result).toEqual(expected);
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const id = '123';
      const dto: UpdateProductDto = { name: 'updated', price: 50, stock: 10 };
      const files = [{ filename: 'img.jpg' }] as Express.Multer.File[];
      const expected = { ...dto, gallery: ['img.jpg'] };

      mockProductService.update.mockResolvedValue(expected);

      const result = await controller.updateProduct(id, files, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto, undefined, ['img.jpg']);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ name: 'one' }, { name: 'two' }];
      mockProductService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return one product', async () => {
      const id = '123';
      const product = { name: 'single' };
      mockProductService.findOne.mockResolvedValue(product);

      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(product);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = '123';
      const deleted = { name: 'deleted' };
      mockProductService.remove.mockResolvedValue(deleted);

      const result = await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleted);
    });
  });
});
