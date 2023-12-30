import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';

@Module({
  providers: [TeachersService],
  controllers: [TeachersController]
})
export class TeachersModule {}
