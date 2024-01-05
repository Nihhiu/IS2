import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';

@Module({
  providers: [AirportService],
  controllers: [AirportController]
})
export class AirportModule {}
