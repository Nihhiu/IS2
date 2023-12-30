import { Controller, Get } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) {}

    @Get()
    async findAll() {
        return this.teachersService.findAll();
    }
}
