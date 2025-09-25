export interface TransactionAccountSplit {
  accountId: string;
  amount: number;
  category: 'income' | 'expense'; 
}