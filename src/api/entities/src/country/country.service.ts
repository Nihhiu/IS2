import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Country } from '@prisma/client';

@Injectable()
export class CountryService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.country.findMany();
    }

    async createCountry(countryData: { country_name: string }): Promise<any> {
        return this.prisma.country.create({
            data: {
                country_name: countryData.country_name,
            },
        });
    }

    async getCountryById(countryId: string): Promise<any> { 
        return this.prisma.country.findUnique({ where: { id: countryId } }); 
    }

    async getCountryIdByISO(countryName: string): Promise<string | null> {
        const country = await this.prisma.country.findFirst({
            where: { country_name: countryName },
            select: { id: true }, 
        });

        return country ? country.id : null;
    }
}
