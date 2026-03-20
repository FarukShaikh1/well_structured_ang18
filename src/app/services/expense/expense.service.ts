import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { ExpenseRequest } from "../../interfaces/expense-request";
import { LocalStorageConstants } from "../../../utils/application-constants";


@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  constructor(private http: HttpClient) {
  }

  getExpenseDetails(expenseId: string) {
    const params = new HttpParams()
      .set("expenseId", expenseId);
    return this.http.get(API_URL.GET_EXPENSE_DETAILS, { params: params });
  }

  getExpenseSummaryList(filter: ExpenseFilterRequest): Observable<any> {
    return this.http.post(API_URL.GET_EXPENSE_SUMMARY_LIST, filter, { params });
  }

  getExpenseReportList(filter: ExpenseFilterRequest): Observable<any> {
    return this.http.post(API_URL.GET_EXPENSE_REPORT_LIST, filter, { params });
  }

  getExpenseList(filter: ExpenseFilterRequest): Observable<any> {
    return this.http.post(API_URL.GET_EXPENSE_LIST, filter, { params });
  }

  addExpense(ExpenseRequest: ExpenseRequest): Observable<any> {
    return this.http.post(
      API_URL.ADD_EXPENSE,
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
      expenseId);
  }

  getExpenseSuggestionList(): Observable<any> {
    return this.http.get(API_URL.GET_EXPENSE_SUGGESTION_LIST); 
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); 
  }

}
