import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaypalConfig, PaypalConfigSchema } from './entities/paypal-config.schema';
import { PaypalFee, PaypalFeeSchema } from './entities/__index';
import { PaypalConfigService, PaypalFeeService } from './services/__index';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaypalConfig.name, schema: PaypalConfigSchema },
      { name: PaypalFee.name, schema: PaypalFeeSchema },
    ]),
  ],
  providers: [PaypalConfigService, PaypalFeeService],
  exports: [PaypalConfigService, PaypalFeeService],
})
export class PaypalModule { }
