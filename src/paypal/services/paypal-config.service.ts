import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaypalConfig } from '../entities/paypal-config.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaypalConfigService {
    constructor(
        @InjectModel(PaypalConfig.name)
        private readonly paypalConfigModel: Model<PaypalConfig>,
    ) { }

    async findAll(): Promise<PaypalConfig[]> {
        return this.paypalConfigModel.find();
    }
}
