import { Controller, Get, Post, Body, HttpStatus, HttpException, Param } from '@nestjs/common';
import { AirportService } from './airport.service';

@Controller('airport')
export class AirportController {
    constructor(private readonly airportService: AirportService) {}

    // Get all airports
    @Get()
    async findAll() {
        return this.airportService.findAll();
    }

    // Get airport by Name
    @Get(':aiportName')
    async getAirportById(@Param('airportName') airportName: string) {
        try {
            const airport = await this.airportService.getAirportById(airportName);
            if (!airport) {
                throw new HttpException('Airport not found', HttpStatus.NOT_FOUND);
            }
            return airport;
        } catch (error) {
            throw new HttpException('Failed to fetch airport', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new airport
    @Post()
    async createAirport(@Body() airportData: {id: string, name: string, region_id: string }) {
        try {
            return await this.airportService.createAirport(airportData);
        } catch (error) {
            throw new HttpException('Failed to create airport', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
