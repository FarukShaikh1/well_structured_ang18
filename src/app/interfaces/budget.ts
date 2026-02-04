export interface Budget {
  id: string|null;
  userId: string;
  payTo: string;
  purpose: string;
  categoryId: string;
  categoryName?: string;
  amount?: number;
}
