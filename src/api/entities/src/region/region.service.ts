import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RegionService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.teacher.findMany();
    }

    async getAllRegion(page, pageSize){}

    async getRegionDetails(id): Promise<any> {}

    async createRegion(regionData: { name: string }) {}
}
