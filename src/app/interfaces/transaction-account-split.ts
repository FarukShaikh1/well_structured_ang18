export interface TransactionAccountSplit {
  accountId: string;
  amount: number;
  category: 'income' | 'expense'; // Or just infer from UI/flow
}