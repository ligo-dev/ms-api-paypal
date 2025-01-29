import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { config } from '../../config';
import { IUserData } from '../interfaces/user-data.interface';
import { ExchangeRate } from '../dto/exchangeRateDTO';


@Injectable()
export class ApiLegalandService {
    private readonly logger = new Logger(ApiLegalandService.name);
    private readonly apiLegaland: string;

    constructor(
        @Inject(config.KEY)
        private readonly configuration: ConfigType<typeof config>,
        private readonly httpService: HttpService,
    ) {
        this.apiLegaland = this.configuration.services.apiLegaland;
    }

    async getUserById(id: string): Promise<IUserData> {
        const host = `${this.apiLegaland}/user-by-id/${id}`;
        this.logger.log(`Call ${host}`);

        const { data } = await this.httpService.axiosRef.get<IUserData>(host);
        return data;
    }
      async getExchangeRate(date: Date): Promise<ExchangeRate | null> {
        const host = `${this.apiLegaland}/exchange-rate/${date}`;
        this.logger.log(`Call ${host}`);
      
        const { data } = await this.httpService.axiosRef.get<ExchangeRate>(host);
        return data ? new ExchangeRate(data) : null;
      }
}
