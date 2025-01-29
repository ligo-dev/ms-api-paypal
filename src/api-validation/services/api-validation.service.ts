import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { config } from '../../config';


@Injectable()
export class ApiValidation {
    private readonly apiLegaland: string;

    constructor(
        @Inject(config.KEY)
        private readonly configuration: ConfigType<typeof config>,
        private readonly httpService: HttpService,
    ) {
        this.apiLegaland = this.configuration.services.apiLegaland;
    }

    async getIncentive(body: object): Promise<any> {
        const host = `${this.apiLegaland}/incentivos-recarga/user`;
        console.log(`Call ${host}`);
        const { data } = await this.httpService.axiosRef.post(host, body);
        return data;
       
    }
}
