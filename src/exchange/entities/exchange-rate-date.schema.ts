import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'exchange_rate_date' })
export class ExchangeRateDate extends Document {
    @Prop({ required: true, type: Number })
    buy: number;

    @Prop({ required: true, type: Number })
    sell: number;

    @Prop({ required: true })
    spread_buy: string;

    @Prop({ required: true })
    spread_sell: string;

    @Prop({ required: true })
    amount: string;

    @Prop({ required: true })
    user: string;

    @Prop({ required: true })
    product: string;

    @Prop({ required: false, default: null })
    product_id: string;

    @Prop({ required: true, type: Boolean })
    state: boolean;

    @Prop({ required: true, type: Boolean })
    deleted: boolean;

    @Prop({ required: true })
    date: string;
}

export const ExchangeRateDateSchema = SchemaFactory.createForClass(ExchangeRateDate);