import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExchangeService } from './services/exchange.service';
import { ExchangeRateDate, ExchangeRateDateSchema } from './entities/exchange-rate-date.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExchangeRateDate.name, schema: ExchangeRateDateSchema },
    ]),
  ],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
