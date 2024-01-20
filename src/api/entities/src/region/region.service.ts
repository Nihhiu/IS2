import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RegionService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.region.findMany();
    }

    async createRegion(regionData: { iso_region: string, country_id: string }): Promise<any> {
        try {
            const country = await this.prisma.region.findFirst({
                where: { id: regionData.country_id },
            });
    
            if (!country) {
                throw new HttpException(`Region with ID ${regionData.country_id} not found`, HttpStatus.NOT_FOUND);
            }
    
            return await this.prisma.airport.create({
                data: {
                    iso_region: regionData.iso_region,
                    country: { connect: { id: country.id } },
                },
            });
        } catch (error) {
            throw new HttpException('Failed to create airport', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    async getRegionById(regionId: string): Promise<any> {
        return this.prisma.region.findUnique({ where: { id: regionId } });
    }
}
