import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
// import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { GetTopProductsDto } from './dto/get-top-products.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @ApiOperation({
    summary: 'Find products',
    description: `Find products with optional filters`,
  })
  @ApiResponse({
    status: 200,
    description: 'all products based on your filter ordered by categoryId',
  })
  @Get()
  async getAllProducts(@Query() filters: GetAllProductsDTO) {
    return this.productsService.getAllProducts(filters);
  }

  @ApiOperation({
    summary: 'Find Top Products',
    description: `Find top products of your region by area-name or lng/lat`,
  })
  @ApiResponse({
    status: 200,
    description:
      'Top 10 products in spacific area with total ordered for each product',
  })
  @ApiResponse({
    status: 400,
    description: 'No area with this data',
  })
  @Get('/top-products')
  async getTopProducts(@Query() filters: GetTopProductsDto) {
    return this.productsService.getTopProducts(filters);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
}
