export interface TransactionReportResponse {
  firstDate?: string;
  lastDate?: string;
  sourceOrReason?: string;
  categoryName?: string;
  description?: string;
  takenAmount?: number;
  givenAmount?: number;
  totalAmount?: number;
}