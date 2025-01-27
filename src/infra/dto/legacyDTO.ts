export interface LegacyRepository {
    getExchangeRate(date: Date): Promise<any>;
    createCollection(docNumber: string, data: object): Promise<any>;
}
  