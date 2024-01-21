import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AirportService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.airport.findMany();
    }

    async createAirport(airportData: {id: string, name: string, region_id: string }): Promise<any> {
        try {
            const region = await this.prisma.region.findFirst({
                where: { id: airportData.region_id },
            });
    
            if (!region) {
                throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
            }
    
            return await this.prisma.airport.create({
                data: {
                    id: airportData.id,
                    name: airportData.name,
                    region: { connect: { id: region.id } },
                },
            });
        } catch (error) {
            throw new HttpException('Failed to create airport', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getAirportById(airportId: string): Promise<any> {
        return this.prisma.airport.findUnique({ where: { id: airportId } });
    }
}
