import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import rax from 'retry-axios';  // Cambié esto para usar `import`
import { ExchangeRate } from '../dto/exchangeRate';
import { CardData } from '../dto/cardData';
import { LegalandRepository } from '../dto/legalandDTO';


interface RetryConfig extends AxiosRequestConfig {
  
  raxConfig: {
    retry: number;
    noResponseRetries: number;
    backoffType:  'static' | 'linear' | 'exponential';
    retryDelay: number;
    onRetryAttempt?: (err: any) => void;
  };
}

export class LegalandApiRepository implements LegalandRepository {
  
  private baseUrl: string;
  private retryConfig: RetryConfig;

  constructor() {
    this.baseUrl = process.env.API_LEGALAND_URL;

    // Cargar dinámicamente retry-axios
    (async () => {
      try {
        const rax = await import('retry-axios');  // Asíncrono
        rax.attach();  // Llamar a attach después de cargar el módulo
        this.retryConfig = {
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
      } catch (error) {
        console.error('Error importing retry-axios:', error);
      }
    })();
  }

  // ACA MIRAR QU EM TRAE LA URL 
  
  async getExchangeRate(date: Date): Promise<ExchangeRate | null> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/exchange-rate/${date}`, this.retryConfig);
      return new ExchangeRate({
        code:data.code,
        id: data.exchange_rate_id,
        buy: data.buy,
        sell: data.sell,
        date: dayjs(data.date).toDate(),
        createdDate: dayjs(data.date_create).toDate(),
        status: data.status,
      });
    } catch (error: any) {
      console.error(error.response?.data);
      return null;
    }
  }

  async getUserData(docNumber: string): Promise<any> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/user/${docNumber}`, this.retryConfig);
      console.log(data);
      return data;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  async getCardById(cardId: string): Promise<CardData | null> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/card-by-id/${cardId}`, this.retryConfig);
      return new CardData(data);
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  async getCardsByClientId(uid: string): Promise<any> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/cards-by-uid-v2/${uid}`, this.retryConfig);
      return data;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  async createCollection(
    transactionId: number,
    docNumber: string,
    amount: number,
    currencyId: number,
    trackingCode: string,
    cardNumber: string,
    fee: number
  ): Promise<any> {
    try {
      const collectionData = {
        id_transaction: transactionId,
        number_document: docNumber,
        amount,
        bank: 17,
        currency: currencyId,
        tracking_code: trackingCode,
        card_number: cardNumber,
        station: process.env.LEGACY_API_ENV,
        fee,
      };
      return await axios.post(`${this.baseUrl}/create-collection`, collectionData, this.retryConfig);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  async searchBlackList(payload: object): Promise<any> {
    try {
      const { data } = await axios.post(`${this.baseUrl}/search-black-list`, payload, this.retryConfig);
      return data;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  async suspendAccount(payload: object): Promise<any> {
    try {
      console.log('Payload - Suspend Account:', payload);
      const { data } = await axios.post(`${this.baseUrl}/suspend-account`, payload, this.retryConfig);
      return data;
    } catch (error: any) {
      console.error('Error Suspend Account:', error);
      return null;
    }
  }

  async updateCollectionStatus(body: object): Promise<any> {
    const collection = {
      number_document: body['number_document'],
      amount: body['amount'],
      bank: body['bank'],
      currency: body['currency'],
      date: body['date'],
      operation_number: body['operation_number'],
      station: body['station'],
      channel: body['channel'],
      status: body['status'],
    };

    try {
      return await axios.post(`${this.baseUrl}/update-collection-status`, collection, this.retryConfig);
    } catch (error: any) {
      console.error('Error Update Collection Status:', error);
      throw error;
    }
  }
}

export default LegalandApiRepository;
