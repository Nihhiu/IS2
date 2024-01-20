import { Controller, Get, Post, Body, HttpStatus, HttpException, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    // Get all countries
    @Get()
    async findAll() {
        return this.countryService.findAll();
    }

    // Create a new country
    @Post()
    async createCountry(@Body() countryData: { iso_country: string }) {
        try {
            return await this.countryService.createCountry(countryData);
        } catch (error) {
            console.error('Error creating country:', error);
            throw new HttpException('Failed to create country', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get country ISO/Name
    @Get(':countryISO')
    async getCountryIdByISO(@Param('countryISO') countryISO: string) {
        try {
            const countryId = await this.countryService.getCountryByISO(countryISO);
            if (!countryId) {
                throw new HttpException('Country not found by name', HttpStatus.NOT_FOUND);
            }
            return { countryId };
        } catch (error) {
            console.error('Error finding country by ISO:', error);
            throw new HttpException('Failed to find country by ISO', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
