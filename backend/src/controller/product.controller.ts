import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FilterProductDto } from '../dtos/filter-product.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('filter')
  filterProducts(@Query() filter: FilterProductDto) {
    return this.productService.filterProducts(filter);
  }
  @Post('single')
  @UseInterceptors(FileInterceptor('image', { storage }))
  createSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(dto, file?.filename);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('gallery', 5, { storage }))
  createMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProductDto,
  ) {
    const galleryFilenames = files.map((file) => file.filename);
    return this.productService.create(dto, undefined, galleryFilenames);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('gallery', 5, { storage }))
  updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateProductDto,
  ) {
    const galleryFilenames = files?.map((file) => file.filename);
    return this.productService.update(id, dto, undefined, galleryFilenames);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
