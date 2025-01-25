import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from './config';
import { UtilsModule } from './utils/utils.module';
import { DbMongoConfigService } from './config/db-mongo-config.service';
import { FeesModule } from './fees/fees.module';
import { PaypalModule } from './paypal/paypal.module';
import { ApiLegalandModule } from './api-legaland/api-legaland.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      useClass: DbMongoConfigService,
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    UtilsModule,
    FeesModule,
    PaypalModule,
    ApiLegalandModule,
    ExchangeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
