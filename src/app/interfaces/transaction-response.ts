export interface TransactionResponse {
  id: number;
  accountId: number;
  amount: number;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  description?: string;
}