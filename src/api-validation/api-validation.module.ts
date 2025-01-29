import { Module } from '@nestjs/common';
import { ApiValidation } from './services/api-validation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiValidation],
  exports: [ApiValidation],
})
export class ApiValidationModule { }
