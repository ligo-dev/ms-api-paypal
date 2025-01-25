import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Range {
    @Prop({ required: true, type: Number })
    minAmount: number;

    @Prop({ required: true, type: Number })
    maxAmount: number;

    @Prop({ required: true, type: Number })
    markUpMax: number;

    @Prop({ required: true, type: Number })
    MarkUpMin: number;

    @Prop({ required: true, type: Number })
    fee: number;

    @Prop({ required: true, type: Boolean })
    formula: boolean;

    @Prop({ required: true, type: Number })
    fxBuy: number;

    @Prop({ required: true, type: Number })
    fxSell: number;

    @Prop({ required: false, type: String })
    spreadOnBuy?: string;

    @Prop({ required: false, type: String })
    spreadOnSale?: string;
}

class Currency {
    @Prop({ required: true, type: [Range] })
    soles: Range[];

    @Prop({ required: true, type: [Range] })
    dollars: Range[];
}

@Schema({ collection: 'paypal_fee' })
export class PaypalFee extends Document {
    @Prop({ required: true })
    type: string;

    @Prop({ required: true, type: Currency })
    currency: Currency;
}

export const PaypalFeeSchema = SchemaFactory.createForClass(PaypalFee);