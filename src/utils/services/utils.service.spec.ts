import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { DatePattern } from '../../common/enums/date-pattern.enum';

describe('UtilsService test', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatDate', () => {
    it('should format a valid date with default pattern', () => {
      const date = new Date('2024-03-20');
      const result = service.formatDate(date);

      expect(result).toBe('2024-03-19');
    });

    it('should format a date with specific pattern', () => {
      const date = new Date('2024-03-20');
      const result = service.formatDate(date, DatePattern.DDMMYYYY);

      expect(result).toBe('19-03-2024');
    });

    it('should return null when date is null or undfined', () => {
      const resultNull = service.formatDate(null);
      const resultUndefined = service.formatDate(undefined);

      expect(resultNull).toBeNull();
      expect(resultUndefined).toBeNull();
    });

    it('should return null when date value is -62135582772000', () => {
      const invalidDate = new Date(-62135582772000);
      const result = service.formatDate(invalidDate);

      expect(result).toBeNull();
    });

    it('should return null when date timestamp is 0', () => {
      const zeroDate = new Date(0);
      const result = service.formatDate(zeroDate);

      expect(result).toBeNull();
    });
  });
});
