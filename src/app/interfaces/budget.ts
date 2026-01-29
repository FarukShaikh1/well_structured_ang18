export interface Budget {
  id: string;
  userId: string;
  payTo: string;
  purpose: string;
  categoryId: string;
  categoryName?: string;
  amount?: number;
}
