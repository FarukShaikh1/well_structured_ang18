export interface TransactionSummaryResponse {
  id: string;
  transactionDate: string;
  sourceOrReason?: string;
  purpose?: string;
  description?: string;
  accountData: { [key: string]: any }; // dynamic fields
}
