import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'paypal_config' })
export class PaypalConfig extends Document {
    @Prop({ required: true })
    atc_number: string;

    @Prop({ required: true })
    max_email: number;

    @Prop({ required: true })
    paypal_amount_fee: number;

    @Prop({ required: true })
    paypal_max_ruc_amount: number;

    @Prop({ required: true })
    paypal_percent_fee: number;

    @Prop({ required: true, type: Number })
    paypal_ruc_fee: number;

    @Prop({ required: true, type: Number })
    paypal_special_fee: number;

    @Prop({ required: true, type: Boolean })
    paypal_special_fee_check: boolean;

    @Prop({ required: true })
    reference_earn_paypal: number;

    @Prop({ required: true })
    reference_earn_paypal_referenced: number;

    @Prop({ required: true })
    reference_min_paypal: number;

    @Prop({ required: true })
    time_collection_paypal_auto: number;

    @Prop({ required: true })
    account_number: string;

    @Prop({ required: true })
    max_amount_pen: number;

    @Prop({ required: true })
    max_amount_usd: number;

    @Prop({ required: true })
    min_amount_pen: number;

    @Prop({ required: true })
    min_amount_usd: number;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    messageTwo: string;

    @Prop({ required: true, type: Boolean })
    enable_fee_new_paypal: boolean;

    @Prop({ required: true, type: Boolean })
    exchange_range_spread_enable: boolean;

    @Prop({ required: true, type: Boolean })
    porcentual_promotional_IGV: boolean;

    @Prop({ required: true, type: Number })
    divisor_calculate_sales_value: number;
}

export const PaypalConfigSchema = SchemaFactory.createForClass(PaypalConfig);