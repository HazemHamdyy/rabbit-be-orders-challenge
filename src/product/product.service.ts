import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
// import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { GetTopProductsDto } from './dto/get-top-products.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AreaService } from 'src/area/area.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
    private areaService: AreaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllProducts(filters: GetAllProductsDTO): Promise<ProductDTO[]> {
    const {
      name,
      categoryIds,
      page,
      take,
    }: {
      name?: string;
      categoryIds?: number[];
      page: number;
      take: number;
    } = filters;
    // GET THE SKIP VALUE BASED ON page and take
    const skip: number = (page - 1) * take;
    const products = await this.prismaService.product.findMany({
      where: {
        ...(categoryIds && {
          categoryId: {
            in: categoryIds,
          },
        }),
        ...(name && {
          name: { contains: name, mode: 'insensitive' },
        }),
      },
      orderBy: {
        categoryId: 'asc',
      },
      skip,
      take,
    });

    return products;
  }

  async getTopProducts(getTopProductsDto: GetTopProductsDto) {
    // GET AREA FIRST
    const area = await this.areaService.getArea(getTopProductsDto);
    if (!area) {
      throw new BadRequestException('No area to search');
    }
    const areaId: number = area.id;
    // GET FROM CACHE IF EXIST
    const cachedProducts = await this.cacheManager.get(
      `top_products_${areaId}`,
    );

    // RETURN THE CACHED VALUE NOT TO MAKE SERVER HEAVY OF REQUESTS AND CAN HANDLE MILLIONS OF REQUEST
    if (cachedProducts) {
      console.log('cached products');
      return cachedProducts;
    }

    // AGGREGTION FUNCTION TO GET THE TOP PRODUCTS ID BASED ON THE AREA THAT THE PRODUCT ORDERED AT AND IF THE PRODUCT IS NOW IN THIS AREA OR NOT
    const aggregationResult = await this.prismaService.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          areaId,
        },
        product: {
          areaId,
        }, //Product may be not in this area anymore
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    // GET THE PRODUCTS DATA
    const products = await this.prismaService.product.findMany({
      where: {
        id: {
          in: aggregationResult.map((item) => item.productId),
        },
      },
      include: {
        area: true,
      },
    });

    const topProducts = aggregationResult.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...product, totalOrdered: item._sum.quantity };
    });

    // SET THIS PRODUCT AS TOP FOR THIS AREA FOR 1 HOUR
    await this.cacheManager.set(
      `top_products_${areaId}`,
      topProducts,
      3600 * 1000,
    );
    return topProducts;
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }
}
