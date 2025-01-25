import { Test, TestingModule } from '@nestjs/testing';
import { ApiLegalandService } from '../services/api-legaland.service';

describe('ApiLegalandService', () => {
  let service: ApiLegalandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiLegalandService],
    }).compile();

    service = module.get<ApiLegalandService>(ApiLegalandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
