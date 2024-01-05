import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Get()
    async getAllCountry(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
      return this.countryService.getAllCountry(page, pageSize);
    }

    @Get('/:id/details')
  async getCountryDetails(@Param('id') id: string): Promise<any> {
    try {
      const countryDetails = await this.countryService.getCountryDetails(id);
      return { success: true, data: countryDetails };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('/addCountry')
  async createCountry(@Body() countryData: { name: string }) {
    const existingCountry = await this.countryService.findCountryByName(countryData.name);

    if (existingCountry) {
      return `Já existe um pais com o nome: ${countryData.name}`;
    }

    const newCountry = await this.countryService.createCountry(countryData);
    return newCountry;
  }

  @Delete('/deleteCountry/:id')
  async deleteCountry(@Param('id') id: string){
    return this.countryService.deleteCountry(+id);
  }

  @Get('/statistics')
  async getCountryStatistics(@Query('year') year: string): Promise<any> {
    try {
      const statistics = await this.countryService.getCountryDetails(year);
      return { success: true, data: statistics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}


/*
    @Get('/statistics')
  async getCountryStatitics(@Query('year') year: number): Promise<any> {
    try {
      const statistics = await this.countryService.getCountryDetails(year);
      return { success: true, data: statistics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/filtered')
  async getFilteredCountry(
    @Query('id') id: number,
    @Query('iso_country') iso_country: number,
    @Query('municipality') municipality: number,
    @Query('gps_code') gps_code: number,
    @Query('local_code') local_code: number,
  ): Promise<any> {
    try {
      const filteredCountry = await this.countryService.getFilteredCountry({
        id,
        iso_country,
        municipality,
        gps_code,
        local_code
      });
      return { success: true, data: filteredCountry };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('/paged')
  async getPagedCountry(
    // TODO ver o que fica em modelYear
    @Query('modelYear', ParseIntPipe) modelYear: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('orderBy') orderBy: string,
  ): Promise<any> {
    try {
      const pagedCountry = await this.countryService.getPagedCountry({
        modelYear,
        page,
        pageSize,
        orderBy,
      });
      return { success: true, data: pagedCountry };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

}


*/

/*
id            Int    @id
  continent     String
  iso_country   String
  countrys       country[]
*/