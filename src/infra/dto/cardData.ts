export class CardData {
    cardId: string;
    uid: string;
    cardNumber: string;
    trackingCode: string;
    status: string;
    isVirtual: boolean;
    enabled: boolean;
    regime: string;
    currency: string;
    bin: string;
  
    constructor(data: {
      cardId: string;
      userId: string;
      card_number?: string;
      cardNumber?: string;
      tracking_code?: string;
      trackingCode?: string;
      status: string;
      isVirtual: boolean;
      enabled: boolean;
      regime?: string;
      regime_code?: string;
      currency: string;
      bin?: string;
    }) {
      this.cardId = data.cardId;
      this.uid = data.userId;
      this.cardNumber = data.card_number || data.cardNumber || '';
      this.trackingCode = data.tracking_code || data.trackingCode || '';
      this.status = data.status;
      this.isVirtual = data.isVirtual;
      this.enabled = data.enabled;
      this.regime = data.regime || data.regime_code || '';
      this.currency = data.currency;
      this.bin = data.bin ? data.bin : this.cardNumber.substring(0, 6);
    }
  }
  