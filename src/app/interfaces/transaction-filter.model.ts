export interface TransactionFilter {
  fromDate: string;
  toDate: string;
  sourceOrReason: string;
  minAmount: number;
  maxAmount: number;
}