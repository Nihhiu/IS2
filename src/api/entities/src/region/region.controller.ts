import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}

    @Get()
    async getAllRegion(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
      return this.regionService.getAllRegion(page, pageSize);
    }

    @Get('/statistics')
  async getRegionStatistics(@Query('year') year: number): Promise<any> {
    try {
      const statistics = await this.regionService.getRegionDetails(year);
      return { success: true, data: statistics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/filtered')
  async getFilteredRegion(
    @Query('id') id: number,
    @Query('iso_region') iso_region: number,
    @Query('municipality') municipality: number,
    @Query('gps_code') gps_code: number,
    @Query('local_code') local_code: number,
  ): Promise<any> {
    try {
      const filteredRegion = await this.regionService.getFilteredRegion({
        id,
        iso_region,
        municipality,
        gps_code,
        local_code
      });
      return { success: true, data: filteredRegion };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/paged')
  async getPagedRegion(
    // TODO ver o que fica em modelYear
    @Query('modelYear', ParseIntPipe) modelYear: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('orderBy') orderBy: string,
  ): Promise<any> {
    try {
      const pagedRegion = await this.regionService.getPagedRegion({
        modelYear,
        page,
        pageSize,
        orderBy,
      });
      return { success: true, data: pagedRegion };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

}


