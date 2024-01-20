import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CountryService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.country.findMany();
    }

    async createCountry(countryData: { iso_country: string }): Promise<any> {
        return this.prisma.country.create({
            data: {
                iso_country: countryData.iso_country,
            },
        });
    }

    async getCountryByISO(isoCountry: string): Promise<any> { 
        return this.prisma.country.findUnique({ where: { iso_country: isoCountry } }); 
    }
}