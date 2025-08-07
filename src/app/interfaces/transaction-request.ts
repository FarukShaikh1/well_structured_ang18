import { TransactionAccountSplit } from "./transaction-account-split";

export interface TransactionRequest {
    transactionGroupId: string|null,
    transactionDate: string,
    sourceOrReason: string,
    purpose: string,
    description: string,
    accountSplits: TransactionAccountSplit[]; // This replaces fixed cash/sbiAccount/etc. add more fields as needed
}
