import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RegionService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.region.findMany();
    }

    async createRegion(regionData: { region_name: string }): Promise<any> {
        return this.prisma.region.create({
            data: {
                region_name: regionData.region_name,
            },
        });
    }

    async getRegionById(regionId: string): Promise<any> {
        return this.prisma.region.findUnique({ where: { id: regionId } });
    }
}
