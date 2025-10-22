export interface ExpenseFilterRequest {
    fromDate: string,
    toDate: string,
    minAmount: number,
    maxAmount: number,
    sourceOrReason: string
}
