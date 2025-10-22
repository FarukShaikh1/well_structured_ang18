export interface TransactionRequest1 {
  accountId: number;
  amount: number;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  description?: string;
}