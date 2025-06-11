import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto } from '../dtos/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getFilteredProducts(filter: FilterProductDto) {
    try {
      const {
        name,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        stock,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filter;

      const query: any = {};

      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          const start = new Date(startDate);
          if (!isNaN(start.getTime())) query.createdAt.$gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          if (!isNaN(end.getTime())) query.createdAt.$lte = end;
        }
        if (Object.keys(query.createdAt).length === 0) delete query.createdAt;
      }

      if (minPrice) {
        query.price = { ...(query.price || {}), $gte: Number(minPrice) };
      }

      if (maxPrice) {
        query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
      }

      if (stock !== undefined && !isNaN(Number(stock))) {
        query.stocks = { $gte: Number(stock) };
      }

      const sort: any = {};
      if (['images','name','price', 'createdAt', 'stock'].includes(sortBy)) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sort['createdAt'] = -1;
      }

      return this.productModel.find(query).sort(sort).exec();
    } catch (error) {
      console.error('Filter Error:', error);
      throw new InternalServerErrorException('Failed to filter products');
    }
  }

  async create(dto: CreateProductDto) {
    const product = new this.productModel(dto);
    return product.save();
  }

  async update(id: string, updateData: UpdateProductDto) {
    const existing = await this.productModel.findById(id);
    if (!existing) throw new NotFoundException('Product not found');
    Object.assign(existing, updateData);
    return existing.save();
  }

  async findAll({ name, sort, order }: any): Promise<Product[]> {
  const filter: any = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  const sortObj: any = {};
  if (sort) {
    sortObj[sort] = order === 'desc' ? -1 : 1;
  }

  return this.productModel.find(filter).sort(sortObj).exec();
}


  async findOne(id: string) {
    return this.productModel.findById(id);
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
