import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
// import { DataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: "root",
})
export class BusinessService {
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getBusinessDetails(businessId: string) {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("businessId", businessId);
    return this.http.get(API_URL.GET_BUSINESS_DETAILS, { params: params });
  }

  getBusinessSummaryList(
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

    return this.http.get(API_URL.GET_BUSINESS_SUMMARY_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getBusinessReportList(
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

    return this.http.get(API_URL.GET_BUSINESS_SUMMARY_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getBusinessList(
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

    return this.http.get(API_URL.GET_BUSINESS_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addBusiness(businessDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.ADD_BUSINESS + this.loggedInUserId,
      businessDetailsForm
    );
  }

  adjustBusiness(businessAdjustmentForm: any): Observable<any> {
    return this.http.post(
      API_URL.BUSINESS_ADJUSTMENT + this.loggedInUserId,
      businessAdjustmentForm
    );
  }

  updateBusiness(businessDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_BUSINESS + this.loggedInUserId,
      businessDetailsForm
    );
  }

  deleteBusiness(businessId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_BUSINESS +
      businessId +
      "&userId=" +
      Number(localStorage.getItem("userId"))
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
    return this.http.get(API_URL.GET_SOURCES_REASONS_LIST, { params: params }); //?businessId=' + businessId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  getBusinessSuggestionList(): Observable<any> {
    const params = new HttpParams().set("userid", this.loggedInUserId);
    return this.http.get(API_URL.GET_BUSINESS_SUGGESTION_LIST, {
      params: params,
    }); //?businessId=' + businessId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  getAvailAmount(
    onDate: string = "",
    accountType: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("onDate", onDate)
      .set("accountType", accountType);
    return this.http.get(API_URL.GET_AVAIL_AMOUNT, { params: params }); //?businessId=' + businessId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  getDescriptionList(
    sourceText: string = "",
    descriptionText: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("sourceText", sourceText)
      .set("descriptionText", descriptionText);
    return this.http.get(API_URL.GET_DESCRIPTION_LIST, { params: params }); //?businessId=' + businessId + '&userId=' + Number(localStorage.getItem("userId")));
  }
  getPurposeList(
    sourceText: string = "",
    purposeText: string = ""
  ): Observable<any> {
    const params = new HttpParams()
      .set("userid", this.loggedInUserId)
      .set("sourceText", sourceText)
      .set("purposeText", purposeText);
    return this.http.get(API_URL.GET_PURPOSE_LIST, { params: params }); //?businessId=' + businessId + '&userId=' + Number(localStorage.getItem("userId")));
  }
}
