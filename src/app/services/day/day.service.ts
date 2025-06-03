import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
@Injectable({
  providedIn: "root",
})
export class DayService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem("userId"));
  }

  getDayDetails(dayId: string) {
    const params = new HttpParams()
      .set("userid", String(localStorage.getItem("userId")))
      .set("dayId", dayId);
    return this.http.get(API_URL.GET_DAY_DETAILS, { params: params });
  }

  getDayList(
    month: string,
    dayType: string,
    searchText: string,
    isToday: boolean = false,
    isTomorrow: boolean = false,
    isYesterday: boolean = false
  ) {
    const params = new HttpParams()
      .set("userid", String(localStorage.getItem("userId")))
      .set("searchText", searchText)
      .set("month", month)
      .set("dayType", dayType)
      .set("isToday", isToday)
      .set("isTomorrow", isTomorrow)
      .set("isYesterday", isYesterday);
    return this.http.get(API_URL.GET_DAY_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addDay(dayDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.ADD_DAY + String(localStorage.getItem("userId")),
      dayDetailsForm
    );
  }

  updateDay(dayDetailsForm: any): Observable<any> {
    return this.http.post(
      API_URL.UPDATE_DAY + String(localStorage.getItem("userId")),
      dayDetailsForm
    );
  }

  uploadImage(
    assetId: string,
    documentType: string,
    dayDetailsForm: any
  ): Observable<any> {
    if(assetId){
    return this.http.post(
      API_URL.UPLOAD_IMAGE +
      String(localStorage.getItem("userId")) +
      "&assetId=" +
      assetId +
      "&documentType=" +
      documentType,
      dayDetailsForm
    );
  }
  else{
    return this.http.post(
      API_URL.UPLOAD_IMAGE +
      String(localStorage.getItem("userId")) +
      "&documentType=" +
      documentType,
      dayDetailsForm
    );
  }

  }


  deleteDay(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_DAY +
      dayId +
      "&userId=" +
      String(localStorage.getItem("userId"))
    );
  }

  approveDay(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.APPROVE_DAY +
      dayId +
      "&userId=" +
      String(localStorage.getItem("userId"))
    );
  }
}
