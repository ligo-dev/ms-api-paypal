import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import rax from 'retry-axios';
import { ExchangeRate } from '../dto/exchangeRate';
import { LegacyRepository } from '../dto/legacyDTO';

interface RetryConfig extends AxiosRequestConfig {
  headers: {
    authorization: string;
  };
  raxConfig: {
    retry: number;
    noResponseRetries: number;
    backoffType: 'static' | 'linear' | 'exponential';
    retryDelay: number;
    onRetryAttempt?: (err: any) => void;
  };
}

export class LegacyApiRepository implements LegacyRepository {
  private baseUrl: string;
  private retryConfig: RetryConfig;

  constructor() {
    this.baseUrl = String(process.env.API_LEGALAND_URL);
    rax.attach();
    this.retryConfig = {
      headers: {
        authorization: String(process.env.LEGACY_HOST_TOKEN),
      },
      raxConfig: {
        retry: 3,
        noResponseRetries: 3,
        backoffType: 'static',
        retryDelay: 3000,
        onRetryAttempt: (err) => {
          const cfg = rax.getConfig(err);
          console.log(`Retry attempt #${cfg?.currentRetryAttempt}`);
        },
      },
    };
  }

  async getExchangeRate(date: Date): Promise<ExchangeRate | null> {
    let exchangeRate: ExchangeRate | null = null;
    try {
      const formattedDate = dayjs(date).format('YYYYMMDD');
      const { data } = await axios.get(
        `${this.baseUrl}/get_exchange_rate/${formattedDate}`,
        this.retryConfig
      );

      if (data.code === 200) {
        exchangeRate = new ExchangeRate({
          code: data.code,
          id: data.data.exchange_rate_id,
          buy: data.data.buy,
          sell: data.data.sell,
          date: dayjs(data.date).toDate(),
          createdDate: dayjs(data.data.date_create).toDate(),
          status: data.status,
        });
      } else {
        exchangeRate = { code: data.code } as any;
      }
    } catch (error) {
      console.error(error);
    }

    return exchangeRate;
  }

  async createCollection(docNumber: string, data: {
    transactionId: string;
    amount: string;
    currencyId: string;
    trackingCode: string;
    cardNumber: string;
    fee: string;
    exchangeRate: string;
}): Promise<any> {
    try {
        const params = new URLSearchParams();
        params.append('id_transaction', data.transactionId);
        params.append('document_number', docNumber);
        params.append('amount', data.amount);
        params.append('bank_id', '17'); // 17: Payoneer
        params.append('currency_id', data.currencyId); // 1: Soles | 2: Dolares
        params.append('tracking_code', data.trackingCode);
        params.append('card_number', data.cardNumber);
        params.append('station', String(process.env.LEGACY_API_ENV)); // DEV or PROD
        params.append('fee', data.fee);
        params.append('exchange_rate', data.exchangeRate);

        return await axios.post(`${this.baseUrl}/create_recaudacion`, params, this.retryConfig);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

}

export default LegacyApiRepository;
