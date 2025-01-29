import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { DatePattern } from '../../common/enums/date-pattern.enum';

@Injectable()
export class UtilsService {
    formatDate(date: Date, pattern: DatePattern = DatePattern.YYYYMMDD): string {
        if (!date || date.valueOf() === -62135582772000 || date.getTime() === 0) {
            return null;
        }
        return format(date, pattern);
    }

    /**
     * Validates if the given amount is within the specified range.
     * 
     * @param amount - The amount to be validated.
     * @param minAmount - The minimum allowed amount.
     * @param maxAmount - The maximum allowed amount.
     * @returns A message indicating the error if the amount is out of range, otherwise null.
     */
    validateAmount(amount: number, minAmount: number, maxAmount: number): string {
        if (amount < minAmount) {
            return `El monto es incorrecto, el monto mínimo permitido es: ${minAmount}`;
        }

        if (amount > maxAmount) {
            return `El monto es incorrecto, el monto máximo permitido es: ${maxAmount}`;
        }

        return null;
    }

    /**
     * Calculates a truncated percentage of an amount.
     * 
     * @param amount - The base amount.
     * @param percentage - The percentage to be applied.
     * @returns The truncated result of the percentage calculation.
     */
    calculatePorcentualTruncated(amount: number, percentage: number): number {
        const result = (amount * percentage).toFixed(3);
        return Number(result.slice(0, -1));
    }

    /**
     * Creates a structured object containing fee ranges for both soles and dollars.
     * 
     * @param obj - The input object containing currency fee ranges.
     * @returns An object with categorized fee ranges for soles and dollars.
     */
    newObjFees(obj: any): { soles: { minAmount: number; maxAmount: number; fee: number }[]; dollars: { minAmount: number; maxAmount: number; fee: number }[] } {
        const fees = { soles: [], dollars: [] };
        try {
            console.log('Iniciando procesamiento de tarifas en soles:', obj);
            if (obj?.currency?.soles?.ranges) {
                fees.soles = obj.currency.soles.ranges.map((element: any) => ({
                    minAmount: element.minAmount,
                    maxAmount: element.maxAmount,
                    fee: element.fee
                }));
            }

            console.log('Iniciando procesamiento de tarifas en dólares');
            if (obj?.currency?.dollars?.ranges) {
                fees.dollars = obj.currency.dollars.ranges.map((element: any) => ({
                    minAmount: element.minAmount,
                    maxAmount: element.maxAmount,
                    fee: element.fee
                }));
            }
        } catch (error) {
            console.error('Error en newObjFees -->', error);
        }

        console.log('NEW FEES --->', fees);
        return fees;
    }
}
