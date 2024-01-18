import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './teachers/teachers.module';
import { AirportModule } from './airport/airport.module';
import { RegionModule } from './region/region.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [TeachersModule, AirportModule, RegionModule, CountryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
