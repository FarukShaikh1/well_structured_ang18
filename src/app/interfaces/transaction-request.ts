export interface TransactionRequest {
    id:string,
    transactionDate: string ,
    sourceOrReason: string,
    cash:number,
    sbiAccount:number,
    cbiAccount:number,
    other:number,
    purpose: string,
    description: string,
}
