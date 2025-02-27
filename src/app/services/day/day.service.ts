import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from '../../../utils/api-url';
@Injectable({
  providedIn: 'root'
})

export class DayService {
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getDayDetails(dayId: number) {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('dayId', dayId)
    return this.http.get(API_URL.GET_DAY_DETAILS, { params: params })

  }

  getDayList(month: string, dayType: string, searchText: string, isToday: boolean = false, isTomorrow: boolean = false, isYesterday: boolean = false){
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('searchText', searchText)
      .set('month', month)
      .set('dayType', dayType)
      .set('isToday', isToday)
      .set('isTomorrow', isTomorrow)
      .set('isYesterday', isYesterday);
    return this.http.get(API_URL.GET_DAY_LIST, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addDay(dayDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.ADD_DAY + Number(localStorage.getItem("userId")), dayDetailsForm);
  }

  updateDay(dayDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPDATE_EXPENSE + Number(localStorage.getItem("userId")), dayDetailsForm);
  }

  uploadImage(assetId: number, documentType: string, dayDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPLOAD_IMAGE + Number(localStorage.getItem("userId")) + '&assetId=' + assetId + '&documentType=' + documentType, dayDetailsForm);
  }

  deleteDay(dayId: number): Observable<any> {
    return this.http.get(API_URL.DELETE_DAY + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  approveDay(dayId: number): Observable<any> {

    return this.http.get(API_URL.APPROVE_DAY + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

}
