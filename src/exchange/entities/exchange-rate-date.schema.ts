import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class RangeDetail {
    @Prop({ required: true })
    detail: string;

    @Prop({ required: true })
    spread_buy: string;

    @Prop({ required: true })
    spread_sell: string;

    @Prop({ required: true, type: Number })
    min_amount: number;

    @Prop({ required: true, type: Number })
    max_amount: number;

    @Prop({ required: true })
    exchange_rate_buy: string;

    @Prop({ required: true })
    exchange_rate_sell: string;
}

const RangeDetailSchema = SchemaFactory.createForClass(RangeDetail);

class DataToRange {
    @Prop({ required: true })
    detail: string;

    @Prop({ required: true, type: [RangeDetailSchema] })
    data: RangeDetail[];
}

const DataToRangeSchema = SchemaFactory.createForClass(DataToRange);

@Schema({ collection: 'exchange_rate_date' })
export class ExchangeRateDate extends Document {
    @Prop({ required: true })
    user: string;

    @Prop({ required: true })
    product: string;

    @Prop({ required: false, default: null })
    product_id: string;

    @Prop({ required: true, type: Number })
    amount: number; 

    @Prop({ required: true })
    spread_buy: string;

    @Prop({ required: true })
    spread_sell: string;

    @Prop({ required: true })
    buy: string;

    @Prop({ required: true })
    sell: string;

    @Prop({ required: true, type: Boolean })
    range_spread_enable: boolean;

    @Prop({ required: true, type: Boolean })
    state: boolean;

    @Prop({ required: true, type: Boolean })
    deleted: boolean;

    @Prop({ required: true })
    date: string;

    @Prop({ required: false, type: [DataToRangeSchema], default: [] })
    data_to_range: DataToRange[];
}

export const ExchangeRateDateSchema = SchemaFactory.createForClass(ExchangeRateDate);
