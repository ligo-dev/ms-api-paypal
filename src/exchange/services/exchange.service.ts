import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { ExchangeRateDate } from '../entities/exchange-rate-date.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExchangeService {
    constructor(
        @InjectModel(ExchangeRateDate.name)
        private readonly exchangeRateDateModel: Model<ExchangeRateDate>,
    ) { }

    async findAll(): Promise<ExchangeRateDate[]> {
        return this.exchangeRateDateModel.find();
    }

    async findOneLasDocumentByProduct(product: string): Promise<ExchangeRateDate> {
        return this.exchangeRateDateModel.findOne({ product, deleted: false }, { sort: { date: -1 } });
    }
}
