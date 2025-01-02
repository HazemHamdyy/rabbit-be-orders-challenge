import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { PrismaService } from 'src/prisma/prisma.service';

//CREATE MODULE FOR EVERY MODEL
@Module({
  providers: [AreaService, PrismaService],
  exports: [AreaService],
})
export class AreaModule {}
