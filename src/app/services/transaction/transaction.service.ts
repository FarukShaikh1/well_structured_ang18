import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { TransactionRequest } from "../../interfaces/transaction-request";
import { LocalStorageConstants } from "../../../utils/application-constants";
// import { DataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }

  getTransactionDetails(transactionId: string) {
    const params = new HttpParams()
      .set("userId", this.loggedInUserId)
      .set("transactionId", transactionId);
    return this.http.get(API_URL.GET_TRANSACTION_DETAILS, { params: params });
  }

  getTransactionSummaryList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_TRANSACTION_SUMMARY_LIST, filter, { params });
  }

  getBalanceList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_BALANCE_LIST, filter, { params });
  }

  getTransactionReportList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_TRANSACTION_REPORT_LIST, filter, { params });
  }

  getTransactionList(filter: ExpenseFilterRequest): Observable<any> {

    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_TRANSACTION_LIST, filter, { params });
  }

  addTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(
      API_URL.ADD_TRANSACTION + this.loggedInUserId,
      TransactionRequest
    );
  }

  adjustTransaction(transactionAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.TRANSACTION_ADJUSTMENT + this.loggedInUserId,
      transactionAdjustmentForm
    );
  }

  updateTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_TRANSACTION + this.loggedInUserId,
      TransactionRequest
    );
  }

  deleteTransaction(transactionId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_TRANSACTION +
      transactionId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }

  getTransactionSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_TRANSACTION_SUGGESTION_LIST, {
      params: params,
    }); //?transactionId=' + transactionId + '&userId=' + String(localStorage.getItem(LocalStorageConstants.USERID)));
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); //?transactionId=' + transactionId + '&userId=' + String(localStorage.getItem(LocalStorageConstants.USERID)));
  }

}
