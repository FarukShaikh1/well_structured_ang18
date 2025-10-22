export interface ExpenseRequest {
    id:string,
    expenseDate: string ,
    sourceOrReason: string,
    cash:number,
    sbiAccount:number,
    cbiAccount:number,
    other:number,
    purpose: string,
    description: string,
}
