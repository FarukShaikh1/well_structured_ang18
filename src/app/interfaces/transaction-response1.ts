export interface TransactionResponse1 {
  id: number;
  accountId: number;
  amount: number;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  description?: string;
}