import { Module } from '@nestjs/common';

import { FeesController } from './controllers/fees.controller';
import { FeesService } from './services/fees.service';
import { PaypalModule } from '../paypal/paypal.module';
import { ApiLegalandModule } from '../api-legaland/api-legaland.module';
import { ApiValidationModule } from '../api-validation/api-validation.module';
import { ExchangeModule } from '../exchange/exchange.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PaypalModule, ExchangeModule, ApiLegalandModule,UtilsModule,ApiValidationModule],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule { }
