import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CountryService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.country.findMany();
    }

    async createCountry(countryData: { id: string, iso_country: string, continent: string }): Promise<any> {
        return this.prisma.country.create({
            data: {
                id: countryData.id,
                iso_country: countryData.iso_country,
                continent: countryData.continent,
            },
        });
    }

    async getCountryByID(idCountry: string): Promise<any> { 
        return this.prisma.country.findUnique({ where: {id: idCountry } }); 
    }
}