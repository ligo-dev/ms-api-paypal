import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CalculateFeeDto, FeeDto } from '../dto/__index';
import { PaypalConfigService } from '../../paypal/services/paypal-config.service';
import { ApiLegalandService } from '../../api-legaland/services/api-legaland.service';
import { UtilsService } from '../../utils/services/utils.service';
import { PaypalFeeService } from '../../paypal/services/paypal-fee.service';
import { ExchangeService } from '../../exchange/services/exchange.service';
import { ConfigType } from '@nestjs/config';
import { config } from 'src/config';

@Injectable()
export class FeesService {
  constructor(
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly paypalConfigService: PaypalConfigService,
    private readonly paypalFeeService: PaypalFeeService,
    private readonly exchangeService: ExchangeService,
    private readonly apiLegalandService: ApiLegalandService,
    private readonly utilsService: UtilsService
  ) { }

  async calculateFee(calculateFeeDto: CalculateFeeDto): Promise<FeeDto> {
    const paypalConfigList = await this.paypalConfigService.findAll();
    const paypalConfig = paypalConfigList[0];

    const isCurrencySoles = calculateFeeDto.currency === '604';

    // Se establece el monto minimo y maximo de acuerdo a la moneda (soles o usd)
    const minAmount = isCurrencySoles ? paypalConfig[0].min_amount_pen : paypalConfig[0].min_amount_usd;
    const maxAmount = isCurrencySoles ? paypalConfig[0].max_amount_pen : paypalConfig[0].max_amount_usd;

    const messageValidateAmount = this.utilsService.validateAmount(calculateFeeDto.amount, minAmount, maxAmount);
    if (!messageValidateAmount) {
      throw new BadRequestException(messageValidateAmount);
    }

    const client = await this.apiLegalandService.getUserById(calculateFeeDto.clientId);
    if (!client) {
      throw new NotFoundException(`Cliente no encontrado con id: ${calculateFeeDto.clientId}`);
    }

    const paypalFee = await this.paypalFeeService.findOne({ type: 'personas' });
    const feeToPerson = isCurrencySoles ? paypalFee.currency.soles : paypalFee.currency.dollars;



    console.log(paypalConfig);

    const mockData = {
      fee: 123.456789,
      fee_2: 123.456789,
      fee_IGV: 18.00,
      fee_IGV_promotional: 10.50,
      data_fee: {
        fee_IGV: 18.00,
        fee_IGV_promotional: 10.50,
        porcentual_IGV: 0.18,
        divisor_calculate_sales_value: 1.18,
        porcentual_promotional_IGV: 0.10,
        net_fee: 105.45
      },
      minimum_amount: 50.00,
      maximum_amount: 5000.00,
      minimum_amount_2: 50.00,
      maximum_amount_2: 5000.00,
      currency: 'USD',
      exchange_rate: 3.750000,
      exchange_rate_2: 3.750000,
      fee_percent: 0.035678,
      fee_amount: 123.456789,
      final_fee: 130.00,
      paypal_fee: 4.99,
      incentivoModule: {
        active: true,
        discount: 5.00,
        type: 'percentage'
      },
      fees: {
        processing_fee: 2.99,
        service_fee: 1.50,
        tax_fee: 0.75
      }
    };

    return mockData;
  }


  /**
 * Obtención del tipo de cambio para compra.
 * @param {Object} data
 * @param {number} data.amount Monto
 * @param {boolean} data.isCurrencySoles True para moneda SOLES
 * @returns {number} Retorna el tipo de cambio menos el Spread por compra
 */
  async getExchangeToBuy({
    amount,
    isCurrencySoles,
  }: {
    amount: number;
    isCurrencySoles: boolean;
  }): Promise<number> {
    console.log(`Inicia getExchangeToBuy: busca valores el tipo de cambio venta, data: ${JSON.stringify({ data: { amount, isCurrencySoles } })}`);
    const activateSpreadPersons = this.configuration.params.exchangeActivateSpreadPersons;
    
    /* if (activateSpreadPersons && isCurrencySoles) {
      try {
        const exchangeRateDate = await this.exchangeService.findOneLasDocumentByProduct('Paypal');
        console.log(
          `getExchangeToBuy: se obtiene datos del ultimo tipo de cambio de paypal, data: ${JSON.stringify({
            _id: exchangeRateDate._id,
            idProduct: exchangeRateDate.product_id,
            exchangeRate: exchangeRateDate.amount,
            date: exchangeRateDate.date,
          })}`,
        );
        if (exchangeRateDate.range_spread_enable && exchangeRateDate.data_to_range.length !== 0) {
          try {
            const dataToCurrency = exchangeRateDate.data_to_range.find((dataCurrency) => dataCurrency.detail === 'soles');
            const dataToRange = dataToCurrency.data.find((range) => range.min_amount <= amount && amount <= range.max_amount);
            console.log(
              `getExchangeToBuy: se usa tipo de cambio por rango, data: ${JSON.stringify({
                amount,
                dataToRange,
                exchangeRateBuy: dataToRange.exchange_rate_buy,
              })}`,
            );
            return parseFloat(dataToRange.exchange_rate_buy);
          } catch (error) {
            console.log(
              `getExchangeToBuy: error para rango, se usa tipo de cambio general, data: ${JSON.stringify({
                amount,
                exchangeRateToRange: exchangeRateDate.data_to_range,
                exchangeRateBuy: exchangeRateDate.buy,
                error: error.message,
              })}`,
            );
            return parseFloat(exchangeRateDate.buy);
          }
        } else {
          console.log(
            `getExchangeToBuy: se usa tipo de cambio general, data: ${JSON.stringify({
              amount,
              rangeSpreadEnable: exchangeRateDate.range_spread_enable,
              exchangeRateBuy: exchangeRateDate.buy,
            })}`,
          );
          return parseFloat(exchangeRateDate.buy);
        }
      } catch (error) {
        console.log(`Para exchangeRateDate falta valores, data: ${error}`);
      }
    }
    const objXR = await this.tipoCambio();
    return parseFloat(objXR.valor); */
    return 3.750000;
  }

}
