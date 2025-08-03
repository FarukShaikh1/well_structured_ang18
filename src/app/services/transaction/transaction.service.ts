import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { TransactionRequest } from "../../interfaces/transaction-request";
// import { DataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem("userId"));
  }

  getTransactionDetails(transactionId: string) {
    const params = new HttpParams()
      .set("userId", this.loggedInUserId)
      .set("transactionId", transactionId);
    return this.http.get(API_URL.GET_EXPENSE_DETAILS, { params: params });
  }

  getTransactionSummaryList(filter: ExpenseFilterRequest): Observable<any> {
    
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_SUMMARY_LIST, filter, { params });
  }

  getTransactionReportList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_REPORT_LIST, filter, { params });
  }

  getTransactionList(filter: ExpenseFilterRequest): Observable<any> {
    
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_LIST, filter, { params });
  }

  addTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(
      API_URL.ADD_EXPENSE + this.loggedInUserId,
      TransactionRequest
    );
  }

  adjustTransaction(transactionAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.EXPENSE_ADJUSTMENT + this.loggedInUserId,
      transactionAdjustmentForm
    );
  }

  updateTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_EXPENSE + this.loggedInUserId,
      TransactionRequest
    );
  }

  deleteTransaction(transactionId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_EXPENSE +
      transactionId +
      "&userId=" +
      String(localStorage.getItem("userId"))
    );
  }

  getTransactionSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_EXPENSE_SUGGESTION_LIST, {
      params: params,
    }); //?transactionId=' + transactionId + '&userId=' + String(localStorage.getItem("userId")));
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); //?transactionId=' + transactionId + '&userId=' + String(localStorage.getItem("userId")));
  }

}
