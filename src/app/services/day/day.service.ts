import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { LocalStorageConstants } from "../../../utils/application-constants";
import { SpecialOccasionRequest } from "../../interfaces/special-occasion-request";
@Injectable({
  providedIn: "root",
})
export class DayService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }

  getDayDetails(dayId: string) {
    const params = new HttpParams()
      .set("userid", String(localStorage.getItem(LocalStorageConstants.USERID)))
      .set("dayId", dayId);
    return this.http.get(API_URL.GET_SPECIAL_OCCASION_DETAILS, { params: params });
  }

  getDayList(
    month: string,
    occasionType: string,
    relation: string,
    searchText: string,
    isToday: boolean = false,
    isTomorrow: boolean = false,
    isYesterday: boolean = false
  ) {
    const params = new HttpParams()
      .set("userid", String(localStorage.getItem(LocalStorageConstants.USERID)))
      .set("searchText", searchText)
      .set("month", month)
      .set("occasionType", occasionType)
      .set("relation", relation)
      .set("isToday", isToday)
      .set("isTomorrow", isTomorrow)
      .set("isYesterday", isYesterday);
    return this.http.get(API_URL.GET_SPECIAL_OCCASION_LIST, { params: params }); //?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&occasionType='+occasionType);
  }

  addDay(specialOccasionRequest: SpecialOccasionRequest): Observable<any> {
    
    specialOccasionRequest.id = null;
    return this.http.post(
      API_URL.ADD_SPECIAL_OCCASION + this.loggedInUserId,
      specialOccasionRequest
    );
  }

  updateDay(specialOccasionRequest: SpecialOccasionRequest): Observable<any> {
    return this.http.post(API_URL.UPDATE_SPECIAL_OCCASION + String(localStorage.getItem(LocalStorageConstants.USERID)), specialOccasionRequest);
  }

  // uploadImage(assetId: string, documentType: string, file: any): Observable<any> {
  //   if (assetId) {
  //     return this.http.post(API_URL.UPLOAD_IMAGE + String(localStorage.getItem(LocalStorageConstants.USERID)) + "&assetId=" + assetId + "&documentType=" + documentType, file);
  //   }
  //   else {
  //     return this.http.post(API_URL.UPLOAD_IMAGE + String(localStorage.getItem(LocalStorageConstants.USERID)) + "&documentType=" + documentType,file);
  //   }
  // }


  deleteDay(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_SPECIAL_OCCASION +
      dayId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }

  approveDay(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.APPROVE_SPECIAL_OCCASION +
      dayId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }
}
