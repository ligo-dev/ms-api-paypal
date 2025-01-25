import { ApiProperty } from '@nestjs/swagger';


export class FeesDto {
    @ApiProperty({ example: 2.99, description: 'Tarifa de procesamiento aplicada' })
    processing_fee: number;

    @ApiProperty({ example: 1.50, description: 'Tarifa de servicio aplicada' })
    service_fee: number;

    @ApiProperty({ example: 0.75, description: 'Tarifa de impuestos aplicada' })
    tax_fee: number;
}

export class IncentivoModuleDto {
    @ApiProperty({ example: true, description: 'Indica si el módulo de incentivos está activo' })
    active: boolean;

    @ApiProperty({ example: 5.00, description: 'Descuento aplicado por el incentivo' })
    discount: number;

    @ApiProperty({ example: 'percentage', description: 'Tipo de incentivo (porcentaje o monto fijo)' })
    type: string;
}

export class DataFeeDto {
    @ApiProperty({ example: 18.00, description: 'Impuesto IGV aplicado' })
    fee_IGV: number;

    @ApiProperty({ example: 10.50, description: 'IGV promocional aplicado' })
    fee_IGV_promotional: number;

    @ApiProperty({ example: 0.18, description: 'Porcentaje de IGV aplicado' })
    porcentual_IGV: number;

    @ApiProperty({ example: 1.18, description: 'Divisor para cálculo del valor de venta' })
    divisor_calculate_sales_value: number;

    @ApiProperty({ example: 0.10, description: 'Porcentaje promocional de IGV' })
    porcentual_promotional_IGV: number;

    @ApiProperty({ example: 105.45, description: 'Tarifa neta después de impuestos' })
    net_fee: number;
}

export class FeeDto {
    @ApiProperty({ example: 123.456789, description: 'Monto total de la tarifa' })
    fee: number;

    @ApiProperty({ example: 123.456789, description: 'Monto total de la tarifa (segunda instancia)' })
    fee_2: number;

    @ApiProperty({ example: 18.00, description: 'Impuesto IGV aplicado a la tarifa' })
    fee_IGV: number;

    @ApiProperty({ example: 10.50, description: 'IGV promocional aplicado' })
    fee_IGV_promotional: number;

    @ApiProperty({ type: () => DataFeeDto, description: 'Detalles adicionales de tarifas e impuestos' })
    data_fee: DataFeeDto;

    @ApiProperty({ example: 50.00, description: 'Monto mínimo permitido' })
    minimum_amount: number;

    @ApiProperty({ example: 5000.00, description: 'Monto máximo permitido' })
    maximum_amount: number;

    @ApiProperty({ example: 50.00, description: 'Monto mínimo permitido (segunda instancia)' })
    minimum_amount_2: number;

    @ApiProperty({ example: 5000.00, description: 'Monto máximo permitido (segunda instancia)' })
    maximum_amount_2: number;

    @ApiProperty({ example: 'USD', description: 'Moneda utilizada en la transacción' })
    currency: string;

    @ApiProperty({ example: 3.750000, description: 'Tipo de cambio aplicado' })
    exchange_rate: number;

    @ApiProperty({ example: 3.750000, description: 'Tipo de cambio aplicado (segunda instancia)' })
    exchange_rate_2: number;

    @ApiProperty({ example: 0.035678, description: 'Porcentaje de tarifa aplicado' })
    fee_percent: number;

    @ApiProperty({ example: 123.456789, description: 'Monto de la tarifa final calculada' })
    fee_amount: number;

    @ApiProperty({ example: 130.00, description: 'Tarifa final a pagar' })
    final_fee: number;

    @ApiProperty({ example: 4.99, description: 'Tarifa aplicada por PayPal' })
    paypal_fee: number;

    @ApiProperty({ type: () => IncentivoModuleDto, description: 'Detalles del módulo de incentivos' })
    incentivoModule: IncentivoModuleDto;

    @ApiProperty({ type: () => FeesDto, description: 'Estructura de tarifas adicionales' })
    fees: FeesDto;
}