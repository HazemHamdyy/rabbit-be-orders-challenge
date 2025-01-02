import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTopProductsDto } from 'src/product/dto/get-top-products.dto';
import * as turf from '@turf/turf';

@Injectable()
export class AreaService {
  constructor(private prismaService: PrismaService) {}

  async getArea(getTopProductsDto: GetTopProductsDto) {
    const { areaName, lat, lng } = getTopProductsDto;
    //AREA NAME HAS THE PRIORITY TO CHECK
    if (areaName) {
      return await this.prismaService.area.findUnique({
        where: { name: areaName },
      });
    } else if (lat && lng) {
      // GET ALL AREAS
      const areas = await this.prismaService.area.findMany();
      // FILTER THEM TO GET THE ONE THAT CONTAINS OUR POINT
      const area = areas.find((area) => {
        const isInside = turf.booleanPointInPolygon(
          turf.point([lng, lat]),
          turf.polygon(area.boundary as any),
        );
        return isInside;
      });
      return area;
    } else {
      // IF CLIENT DIDN'T WRITE ANY PARAMS RETURN NULL
      return null;
    }
  }
}
