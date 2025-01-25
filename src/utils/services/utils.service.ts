import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { DatePattern } from '../../common/enums/date-pattern.enum';

@Injectable()
export class UtilsService {
    formatDate(date: Date, pattern: DatePattern = DatePattern.YYYYMMDD): string {
        if (!date || date.valueOf() === -62135582772000 || date.getTime() === 0) {
            return null
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
}
