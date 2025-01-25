import { Module } from '@nestjs/common';
import { ApiLegalandService } from './services/api-legaland.service';

@Module({
  providers: [ApiLegalandService],
  exports: [ApiLegalandService],
})
export class ApiLegalandModule {}
