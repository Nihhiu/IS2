import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';

describe('CountryController', () => {
  let service: CountryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryController],
    }).compile();

    service = module.get<CountryController>(CountryController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
