import dayjs from 'dayjs';

export class ExchangeRate {
  code: string;
  id: string;
  buy: string;
  sell: string;
  date: Date;
  createdDate: Date;
  status: string;

  constructor(data: {
    code: string;
    id: string;
    buy: string;
    sell: string;
    date: Date;
    createdDate: Date;
    status: string;
  }) {
    this.code = data.code;
    this.id = data.id;
    this.buy = data.buy;
    this.sell = data.sell;
    this.date = dayjs(data.date).toDate();
    this.createdDate = dayjs(data.createdDate).toDate();
    this.status = data.status;
  }
}

export default ExchangeRate;