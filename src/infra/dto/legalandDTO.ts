import { ExchangeRate } from './exchangeRate';

export interface LegalandRepository {
  getExchangeRate(date: Date): Promise<ExchangeRate | null>;
}
