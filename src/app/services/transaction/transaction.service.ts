import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { TransactionRequest } from "../../interfaces/transaction-request";
import { LocalStorageConstants } from "../../../utils/application-constants";


@Injectable({
  providedIn: "root",
})
export class TransactionService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }

  getTransactionDetails(transactionId: string) {
    return this.http.get(API_URL.GET_TRANSACTION_DETAILS+transactionId);
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

  getCategoryWiseReportList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_CATEGORY_WISE_REPORT_LIST, filter, { params });
  }

  getBudgetWiseReportList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_BUDGET_WISE_REPORT_LIST, filter, { params });
  }

  getTransactionList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_TRANSACTION_LIST, filter);
  }

  addTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(
      API_URL.ADD_TRANSACTION ,
      TransactionRequest
    );
  }

  adjustTransaction(transactionAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.TRANSACTION_ADJUSTMENT,
      transactionAdjustmentForm
    );
  }

  updateTransaction(TransactionRequest: TransactionRequest): Observable<any> {
    return this.http.put(
      API_URL.UPDATE_TRANSACTION,
      TransactionRequest
    );
  }

  deleteTransaction(transactionId: string): Observable<any> {
    return this.http.delete(
      API_URL.DELETE_TRANSACTION +
      transactionId 
    );
  }

  getTransactionSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_TRANSACTION_SUGGESTION_LIST, {
      params: params,
    });
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params });
  }

}
