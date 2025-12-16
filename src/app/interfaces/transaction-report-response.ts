export interface TransactionReportResponse {
  firstDate?: string;
  lastDate?: string;
  sourceOrReason?: string;
  subCategoryName?: string;
  description?: string;
  takenAmount?: number;
  givenAmount?: number;
  totalAmount?: number;
}