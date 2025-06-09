import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto } from '../dtos/filter-product.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async filterProducts(filter: FilterProductDto) {
    try {
      const { name, startDate, endDate, minPrice, maxPrice, stock } = filter;
      const query: any = {};

      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      if (startDate || endDate) {
        query.createdAt = {};

        if (startDate) {
          const start = new Date(startDate);
          if (!isNaN(start.getTime())) {
            query.createdAt.$gte = start;
          }
        }

        if (endDate) {
          const end = new Date(endDate);
          if (!isNaN(end.getTime())) {
            query.createdAt.$lte = end;
          }
        }

        if (Object.keys(query.createdAt).length === 0) {
          delete query.createdAt;
        }
      }

      if (minPrice) {
        query.price = { ...(query.price || {}), $gte: Number(minPrice) };
      }

      if (maxPrice) {
        query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
      }

      if (stock !== undefined && !isNaN(Number(stock))) {
        query.stock = Number(stock);
      }

      return this.productModel.find(query);
    } catch (error) {
      console.error('Filter Error:', error);
      throw new InternalServerErrorException('Failed to filter products');
    }
  }

  async create(dto: CreateProductDto, image?: string, gallery?: string[]) {
    const product = new this.productModel({ ...dto, image, gallery });
    return product.save();
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    image?: string,
    gallery?: string[],
  ) {
    const data: any = { ...dto };
    if (image) data.image = image;
    if (gallery) data.gallery = gallery;
    return this.productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    return this.productModel.findById(id);
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
