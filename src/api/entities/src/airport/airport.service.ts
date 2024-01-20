import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AirportService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.airport.findMany();
    }

    async createAirport(airportData: { airport_name: string }): Promise<any> {
        return this.prisma.airport.create({
            data: {
                airport_name: airportData.airport_name,
            },
        });
    }

    async getAirportById(airportId: string): Promise<any> {
        return this.prisma.airport.findUnique({ where: { id: airportId } });
    }
}
