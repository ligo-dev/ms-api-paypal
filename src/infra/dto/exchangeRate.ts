export class ExchangeRate {
    code: string;
    id: string;
    buy: string;
    sell: string;
    date: Date;
    createdDate: Date;
    status:string;
  
    constructor(data: {
      code: string;
      id: string;
      buy: string;
      sell: string;
      date: Date;
      createdDate: Date;
      status:string;
    }) {
      this.code = data.code;
      this.id = data.id;
      this.buy = data.buy;
      this.sell = data.sell;
      this.date = data.date;
      this.createdDate = data.createdDate;
      this.status = data.status;
    }
  }
  
  export default ExchangeRate;
  