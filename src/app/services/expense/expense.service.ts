import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
// import { DataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem("userId"));
  }

  getExpenseDetails(expenseId: string) {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("expenseId", expenseId);
    return this.http.get(API_URL.GET_EXPENSE_DETAILS, { params: params });
  }

  getExpenseSummaryList(
    fromDate: string,
    toDate: string,
    sourceOrReason: string,
    minAmount: number,
    maxAmount: number,
    modeOfTransaction: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("sourceOrReason", sourceOrReason)
      .set("minAmount", minAmount)
      .set("maxAmount", maxAmount)
      .set("modeOfTransaction", modeOfTransaction);

    return this.http.get(API_URL.GET_EXPENSE_SUMMARY_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getExpenseReportList(
    fromDate: string,
    toDate: string,
    sourceOrReason: string,
    minAmount: number,
    maxAmount: number,
    modeOfTransaction: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("sourceOrReason", sourceOrReason)
      .set("minAmount", minAmount)
      .set("maxAmount", maxAmount)
      .set("modeOfTransaction", modeOfTransaction);

    return this.http.get(API_URL.GET_EXPENSE_SUMMARY_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getExpenseList(
    fromDate: string,
    toDate: string,
    sourceOrReason: string,
    minAmount: number,
    maxAmount: number,
    modeOfTransaction: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("sourceOrReason", sourceOrReason)
      .set("minAmount", minAmount)
      .set("maxAmount", maxAmount)
      .set("modeOfTransaction", modeOfTransaction);

    return this.http.get(API_URL.GET_EXPENSE_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.ADD_EXPENSE + this.loggedInUserId,
      expenseDetailsForm
    );
  }

  adjustExpense(expenseAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.EXPENSE_ADJUSTMENT + this.loggedInUserId,
      expenseAdjustmentForm
    );
  }

  updateExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_EXPENSE + this.loggedInUserId,
      expenseDetailsForm
    );
  }

  deleteExpense(expenseId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_EXPENSE +
        expenseId +
        "&userId=" +
        String(localStorage.getItem("userId"))
    );
  }

  getSourceOrReasonList(
    fromDt: string = "",
    toDt: string = "",
    searchText: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("fromDate", fromDt)
      .set("toDate", toDt)
      .set("searchText", searchText);
    return this.http.get(API_URL.GET_SOURCES_REASONS_LIST, { params: params }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }

  getExpenseSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_EXPENSE_SUGGESTION_LIST, {
      params: params,
    }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }

  getDescriptionList(
    sourceText: string = "",
    descriptionText: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("sourceText", sourceText)
      .set("descriptionText", descriptionText);
    return this.http.get(API_URL.GET_DESCRIPTION_LIST, { params: params }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }
  getPurposeList(
    sourceText: string = "",
    purposeText: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("sourceText", sourceText)
      .set("purposeText", purposeText);
    return this.http.get(API_URL.GET_PURPOSE_LIST, { params: params }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }

  exportGridToExcel(dataSource: any) {
    return this.http.get(API_URL.DOWNLOAD_EXPENSE_LIST, { params: dataSource }); //?expenseId=' + expenseId + '&userId=' + String(localStorage.getItem("userId")));
  }
}
