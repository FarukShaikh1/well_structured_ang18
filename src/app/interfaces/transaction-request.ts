import { TransactionAccountSplit } from "./transaction-account-split";

export interface TransactionRequest {
    transactionGroupId: string|null,
    transactionDate: string,
    sourceOrReason: string,
    purpose: string,
    description: string,
    accountSplits: TransactionAccountSplit[]; 
}
