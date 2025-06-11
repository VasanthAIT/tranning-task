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
  UsePipes,
  ValidationPipe,
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
  async getFilteredProducts(@Query() query: FilterProductDto) {
    return this.productService.getFilteredProducts(query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async createProductWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    const imageName = file?.filename;
    return this.productService.create({ ...body, images: [imageName] });
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('gallery', 5, { storage }))
  async createMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProductDto,
  ) {
    const galleryFilenames = files.map((file) => file.filename);
    return this.productService.create({ ...dto, images: galleryFilenames });
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateProductDto,
  ) {
    const imageNames = files.map((file) => file.filename);
    return this.productService.update(id, { ...body, images: imageNames });
  }

  @Get()
async findAll(@Query() query: any) {
  const { name, sort, order } = query;
  return this.productService.findAll({ name, sort, order });
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
