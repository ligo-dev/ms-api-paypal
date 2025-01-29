import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CalculateFeeDto, FeeDto } from '../dto/__index';
import { PaypalConfigService } from '../../paypal/services/paypal-config.service';
import { ApiLegalandService } from '../../api-legaland/services/api-legaland.service';
import { ApiValidation } from '../../api-validation/services/api-validation.service';
import { UtilsService } from '../../utils/services/utils.service';
import { PaypalFeeService } from '../../paypal/services/paypal-fee.service';
import { ExchangeService } from '../../exchange/services/exchange.service';
import { ConfigType } from '@nestjs/config';
import { config } from 'src/config';
import * as moment from 'moment-timezone'; 

@Injectable()
export class FeesService {
  // Herramientas modulos
  constructor(
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly paypalConfigService: PaypalConfigService,
    private readonly paypalFeeService: PaypalFeeService,
    private readonly exchangeService: ExchangeService,
    private readonly apiLegalandService: ApiLegalandService,
    private readonly apiValidation: ApiValidation,
    private readonly utilsService: UtilsService
  ) { }
  //feeComission40
  async calculateFee(calculateFeeDto: CalculateFeeDto): Promise<FeeDto> {
    try {
        const paypalConfigList = await this.paypalConfigService.findAll();
        const paypalConfig = paypalConfigList[0];

        const isCurrencySoles = calculateFeeDto.currency === '604';

        // Se establece el monto mínimo y máximo de acuerdo a la moneda (soles o USD)
        const minAmount = isCurrencySoles ? paypalConfig.min_amount_pen : paypalConfig.min_amount_usd;
        const maxAmount = isCurrencySoles ? paypalConfig.max_amount_pen : paypalConfig.max_amount_usd;

        const messageValidateAmount = this.utilsService.validateAmount(calculateFeeDto.amount, minAmount, maxAmount);
        if (messageValidateAmount) {
            throw new BadRequestException(messageValidateAmount);
        }

        const client = await this.apiLegalandService.getUserById(calculateFeeDto.clientId);
        if (!client) {
            throw new NotFoundException(`Cliente no encontrado con id: ${calculateFeeDto.clientId}`);
        }

        const paypalFee = await this.paypalFeeService.findOne({ type: 'personas' });
        const fee = isCurrencySoles ? paypalFee.currency.soles : paypalFee.currency.dollars;

        const feeToPerson = await this.getExchangeToBuy({ amount: calculateFeeDto.amount, isCurrencySoles });

        console.log('Exchange rate -->', feeToPerson);
        if (feeToPerson === 0) {
            console.error({
                status: 0,
                errors: [{ field: 'general', message: 'Ocurrió un problema, por favor intente nuevamente' }],
                code: 422,
                data: null,
                date: moment().tz("America/Lima").format('YYYY-MM-DD HH:mm:ss'),
            });
            return null;
        }

        let calculatedMarkup = 0;
        let finalExchangeRate = feeToPerson;
        let finalFeeValue = 0;
        let finalFeeAmount = 0;
        let markupPercentage = 0;

        for (const range of fee) {
          // calcula el rango de minimo y maximo
            const isWithinRange = range.minAmount <= calculateFeeDto.amount && range.maxAmount >= calculateFeeDto.amount;

            if (isCurrencySoles && isWithinRange) {
                console.log('Evaluando rango para soles', range);
                // Si la fórmula está activa, ajusta la tarifa y el tipo de cambio de acuerdo con el markup calculado. Si la fórmula no está activa, usa una tarifa fija
                if (range.formula) {
                    calculatedMarkup = 1 - ((calculateFeeDto.amount - 6) * feeToPerson) / (calculateFeeDto.amount - range.fee) / feeToPerson;
                    markupPercentage = calculatedMarkup * 100;

                    if (markupPercentage > range.markUpMax) {
                        finalFeeAmount = range.fee;
                        finalFeeValue = range.fee;
                        finalExchangeRate = feeToPerson - (range.markUpMax * feeToPerson) / 100;
                    } else if (markupPercentage < range.MarkUpMin) {
                        finalFeeAmount = range.fee;
                        finalFeeValue = range.fee;
                        finalExchangeRate = feeToPerson - (range.MarkUpMin * feeToPerson) / 100;
                    } else {
                        finalFeeAmount = range.fee;
                        finalFeeValue = range.fee;
                        finalExchangeRate = feeToPerson - calculatedMarkup * feeToPerson;
                    }
                } else {
                    finalFeeAmount = range.fee;
                    finalFeeValue = range.fee;
                    finalExchangeRate = feeToPerson;
                }
            } else if (!isCurrencySoles && isWithinRange) {
                finalFeeAmount = range.fee;
                finalFeeValue = range.fee;
                finalExchangeRate = feeToPerson;
            }
        }

        console.log(`Cálculos --> ${JSON.stringify({ finalFee: finalFeeValue, finalFx: finalExchangeRate, finalFeeAmount, feeToPerson })}`);

        const secuencial = 123;
        const newN = String(secuencial).padStart(8, '0');
        console.log('Secuencial -->', newN);

        let incentivoModule: any = {};
        try {
            incentivoModule = await this.apiValidation.getIncentive({
                userDocType: Number(client.tipo_doc_ident),
                userDocNumber: client.num_doc_ident,
                module: 'Paypal',
            }) || {};
        } catch (error) {
            console.error('Error obteniendo incentivo:', error);
        }

        const isUSD = calculateFeeDto.currency === '840';
        const usedPaypalFee = isUSD ? (paypalConfig.enable_fee_new_paypal === false ? 0 : calculateFeeDto.amount * 0.01) : 0;

        const configGeneral = await this.paypalConfigService.findAll();
        console.log('DB configGeneral', configGeneral);

        // ACA ME LLEGA UN BOLEANO O UN VALOR NUMERICO
        //const porcentualIGV = configGeneral[0]?.porcentual_promotional_IGV || 0.18;
        // PARA PROSEGUIR
        const porcentualIGV = configGeneral[0]?.porcentual_promotional_IGV === true ? 0.18 : 0;

        console.log('Porcentual IGV usado', porcentualIGV);

        const divisorCalculateSalesValue = 1 + porcentualIGV || 1.18;
        console.log('Divisor de cálculo de IGV para Paypal', divisorCalculateSalesValue);

        const salesValue = this.utilsService.calculatePorcentualTruncated(finalFeeValue, 1 / divisorCalculateSalesValue);
        console.log('Valor de venta usado', salesValue);

        //const porcentualPromotionalIGV = paypalConfig.porcentual_promotional_IGV || 0;
        const porcentualPromotionalIGV = configGeneral[0]?.porcentual_promotional_IGV === true ? 0.18 : 0;

        console.log('Porcentual IGV promocional para Paypal', porcentualPromotionalIGV);

        const feeIGVPromotional = this.utilsService.calculatePorcentualTruncated(salesValue, porcentualIGV * porcentualPromotionalIGV);
        const netFee = finalFeeValue - feeIGVPromotional;
        console.log('Neto de la tarifa con IGV', netFee);

        const feeIGV = this.utilsService.calculatePorcentualTruncated(netFee, porcentualIGV);
        console.log('IGV aplicado a la tarifa', feeIGV);

        const usedFinalFee = isUSD
            ? parseFloat((netFee + feeIGV).toFixed(6)) + usedPaypalFee
            : parseFloat((netFee + feeIGV).toFixed(6));

        const responseData = {
            fee: parseFloat(finalFeeAmount.toFixed(6)),
            fee_IGV: feeIGV,
            fee_IGV_promotional: feeIGVPromotional,
            data_fee: {
                porcentual_IGV: porcentualIGV,
                divisor_calculate_sales_value: divisorCalculateSalesValue,
                porcentual_promotional_IGV: porcentualPromotionalIGV,
                net_fee: netFee,
            },
            minimum_amount: minAmount,
            maximum_amount: maxAmount,
            currency: 'USD',
            exchange_rate: parseFloat(finalExchangeRate.toFixed(6)),
            fee_percent: isCurrencySoles ? parseFloat(calculatedMarkup.toFixed(6)) : parseFloat(finalFeeAmount.toFixed(6)),
            fee_amount: parseFloat(finalFeeAmount.toFixed(6)),
            final_fee: usedFinalFee,
            paypal_fee: usedPaypalFee,
            fees: this.utilsService.newObjFees(fee),
        };

        console.log('Response --->', incentivoModule, responseData);

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
        // return responseData;
    } catch (error) {
        console.error('Error en cálculo de tarifa -->', error);
        return {
            status: 0,
            errors: [{ field: 'general', message: 'Ocurrió un problema, por favor intente nuevamente' }],
            code: 422,
            data: null,
            date: moment().tz("America/Lima").format('YYYY-MM-DD HH:mm:ss'),
        } as any;
    }
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
    
    if (activateSpreadPersons && isCurrencySoles) {
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
    return (objXR.valor);
  }

  /**
   * Obtiene el tipo de cambio actual desde Legaland API.
   * @returns {Promise<{ valor: number; date: string }>}
   */
 async tipoCambio(): Promise<{ valor: number; date: string }> {
  console.log('Inicia tipoCambio: Legaland');
  let valor = 0;
  let date = "";
  let data;

  try {
    // Cambiar para que `date` sea un objeto `Date` en lugar de un string
    const dateObj = moment().tz('America/Lima').toDate(); // Esto te da un objeto Date
    console.log('fecha tipo de cambio 1-->', dateObj);
    
    data = await this.apiLegalandService.getExchangeRate(dateObj);  // Pasa un Date
    console.log('respuesta -->', data);

    if (data === null) {
      console.log('no hay tipo de cambio 1, fecha -->' + dateObj);
      const dateObj2 = moment().tz('America/Lima').subtract(1, 'd').toDate();
      data = await this.apiLegalandService.getExchangeRate(dateObj2);  // Pasa un Date
      console.log('fecha tipo de cambio 2 -->', dateObj2);
      
      if (data === null) {
        console.log('no hay tipo de cambio 2, fecha -->' + dateObj2);
        const dateObj3 = moment().tz('America/Lima').subtract(2, 'd').toDate();
        data = await this.apiLegalandService.getExchangeRate(dateObj3);  // Pasa un Date
        console.log('fecha tipo de cambio 3 -->', dateObj3);
        console.log('resultado tipo de cambio 3 -->', data);
      }
    } else {
      console.log('si hay data');
    }

    valor = data.buy;
    date = moment(dateObj).format('yyyyMMDD'); 

  } catch (error) {
    valor = 0;
    console.log('error al obtener tipo de cambio-->', error);
  }

  console.log('resultado final -->', { valor, date }, data);
  return { valor, date };
}

}
