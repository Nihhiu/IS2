import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Country } from '@prisma/client';

@Injectable()
export class CountryService {
    private prisma = new PrismaClient();

    async getAllCountry(page: number = 1, pageSize: number = 10){
        try{
            const country = await this.prisma.country.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
            });

            const totalCountry = await this.prisma.country.count();

            return {data: country, total: totalCountry};
        }catch (error){
            throw new Error('Error fetching country: ${error.message}');
        }
    }

  async createCountry(countryData: { name: string }){
    return this.prisma.country.create({
        data: {
            name: countryData.name,
        },
    });
  } 

  async deleteCountry(iso_country: number){
        return this.prisma.country.delete({where: {id: iso_country.toString()}});
  }

  async updateCountry(iso_country: number, countryData: {name: string}){
    return this.prisma.country.update({where: {id: iso_country.toString()}, data: countryData});
  }

  async getCountryDetails(iso_country: string): Promise<any> {
    const countryDetails = await this.prisma.country.findUnique({
        where: {
            id: iso_country,
        }, 
        include: {
            models:{
                include:{
                    continent: true,
                },
            },
        },
    });
    return countryDetails;
  }

  async findCountryByName(name: string){
    const existingCountry = await this.prisma.country.findFirsyt({
        where: {
            name: name,
        },
    });
    return existingCountry;
  }
}
