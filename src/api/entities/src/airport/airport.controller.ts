import { Controller, Get, Query, Param } from '@nestjs/common';
import { AirportService } from './airport.service';

@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAllAirport() {
      return this.airportService.findAll();
  }

  @Get()
  async getAllAirport(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.airportService.getAllAirport(page, pageSize);
  }

  @Get('/statistics')
  async getAirportStatistics(@Query('year') year: number): Promise<any> {
    try {
      const statistics = await this.airportService.getAirportDetails(year);
      return { success: true, data: statistics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/filtered')
  async getFilteredAirport(
    @Query('ident') ident: number,
    @Query('type') type: number,
    @Query('name') name: number,
    @Query('elevation_ft') elevation_ft: number,
    @Query('iata_code') iata_code: number,
    @Query('coordinates') coordinates: number,
  ): Promise<any> {
    try {
      const filteredAirport = await this.airportService.getFilteredAirport({
        ident,
        type,
        name,
        elevation_ft,
        iata_code,
        coordinates
      });
      return { success: true, data: filteredAirport };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/paged')
  async getPagedAirport(
    // TODO ver o que fica em modelYear
    @Query('modelYear', ParseIntPipe) modelYear: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('orderBy') orderBy: string,
  ): Promise<any> {
    try {
      const pagedAirport = await this.airportService.getPagedAirport({
        modelYear,
        page,
        pageSize,
        orderBy,
      });
      return { success: true, data: pagedAirport };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/*
id              Int     @id
  ident           String
  type            String
  name            String
  elevation_ft    String
  iata_code       String
  coordinates     String
*/