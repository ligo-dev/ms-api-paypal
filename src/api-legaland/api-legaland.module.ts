import { Module } from '@nestjs/common';
import { ApiLegalandService } from './services/api-legaland.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiLegalandService],
  exports: [ApiLegalandService],
})
export class ApiLegalandModule { }
