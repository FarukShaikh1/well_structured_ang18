import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { ExpenseRequest } from "../../interfaces/expense-request";
// import { DataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }

  getExpenseDetails(expenseId: string) {
    const params = new HttpParams()
      .set("userId", this.loggedInUserId)
      .set("expenseId", expenseId);
    return this.http.get(API_URL.GET_EXPENSE_DETAILS, { params: params });
  }

  getExpenseSummaryList(filter: ExpenseFilterRequest): Observable<any> {
    
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_SUMMARY_LIST, filter, { params });
  }

  getExpenseReportList(filter: ExpenseFilterRequest): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_REPORT_LIST, filter, { params });
  }

  getExpenseList(filter: ExpenseFilterRequest): Observable<any> {
    
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.post(API_URL.GET_EXPENSE_LIST, filter, { params });
  }

  addExpense(ExpenseRequest: ExpenseRequest): Observable<any> {
    return this.http.post(
      API_URL.ADD_EXPENSE + this.loggedInUserId,
      ExpenseRequest
    );
  }

  adjustExpense(expenseAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.EXPENSE_ADJUSTMENT + this.loggedInUserId,
      expenseAdjustmentForm
    );
  }

  updateExpense(ExpenseRequest: ExpenseRequest): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_EXPENSE + this.loggedInUserId,
      ExpenseRequest
    );
  }

  deleteExpense(expenseId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_EXPENSE +
      expenseId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }

  getExpenseSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_EXPENSE_SUGGESTION_LIST, {
      params: params,
    }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem(LocalStorageConstants.USERID)));
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem(LocalStorageConstants.USERID)));
  }

}
