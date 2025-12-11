export interface CategoryWiseTransactionReportResponse {
  firstDate?: string;
  lastDate?: string;
  category?: string;
  sourceOrReason?: string;
  description?: string;
  takenAmount?: number;
  givenAmount?: number;
  totalAmount?: number;
}