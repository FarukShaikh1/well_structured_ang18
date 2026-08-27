export interface FoodMenu {
  id: string | null;
  userId: string;
  menuDate: number;
  sequence: number;
  breakfast?: string;
  lunch?: string;
  eveningBreakfast?: string;
  dinner?: string;
}