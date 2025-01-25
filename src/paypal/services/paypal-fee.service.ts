import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, RootFilterQuery } from 'mongoose';
import { PaypalFee } from '../entities/paypal-fee.schema';

@Injectable()
export class PaypalFeeService {
    constructor(
        @InjectModel(PaypalFee.name)
        private readonly paypalFeeModel: Model<PaypalFee>,
    ) { }

    async findAll(): Promise<PaypalFee[]> {
        return this.paypalFeeModel.find();
    }

    async findOne(where: FilterQuery<PaypalFee>): Promise<PaypalFee> {
        return this.paypalFeeModel.findOne(where);
    }
}
