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

    // Get country by ID
    @Get(':countryId')
    async getCountryById(@Param('countryId') countryId: string) {
        try {
            const country = await this.countryService.getCountryById(countryId);
            if (!country) {
                throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
            }
            return country;
        } catch (error) {
            console.error('Error fetching country by ID:', error);
            throw new HttpException('Failed to fetch country by ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new country
    @Post()
    async createCountry(@Body() countryData: { country_name: string }) {
        try {
            return await this.countryService.createCountry(countryData);
        } catch (error) {
            console.error('Error creating country:', error);
            throw new HttpException('Failed to create country', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get country ID by ISO/Name
    @Get('name/:countryISO')
    async getCountryIdByISO(@Param('countryISO') countryISO: string) {
        try {
            const countryId = await this.countryService.getCountryIdByISO(countryISO);
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
