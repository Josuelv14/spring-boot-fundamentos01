import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { PartialUpdateProductDto } from './dtos/partial-update-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(): Promise<ProductResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: PartialUpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.partialUpdate(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(Number(id));
  }
}
