import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [TeachersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
