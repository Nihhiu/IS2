import { Controller, Get, Post, Body, HttpStatus, HttpException, Param } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}

    // Get all regions
    @Get()
    async findAll() {
        return this.regionService.findAll();
    }

    // Get region by ID
    @Get(':regionId')
    async getRegionById(@Param('regionId') regionId: string) {
        try {
            const region = await this.regionService.getRegionById(regionId);
            if (!region) {
                throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
            }
            return region;
        } catch (error) {
            throw new HttpException('Failed to fetch region', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new region
    @Post()
    async createRegion(@Body() regionData: { region_name: string }) {
        try {
            return await this.regionService.createRegion(regionData);
        } catch (error) {
            throw new HttpException('Failed to create region', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
