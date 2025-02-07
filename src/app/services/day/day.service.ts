import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as constants from '../../../utils/constants';
import { getLocaleMonthNames } from '@angular/common';
import { environmentDev } from '../../../environments/environment.dev';
@Injectable({
  providedIn: 'root'
})

export class DayService {
  baseUrl = environmentDev.serverUrl;
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getDayDetails(dayId: number) {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('dayId', dayId)
    return this.http.get(this.baseUrl + constants.DAYURL + 'getDayDetails', { params: params })

  }

  getDayList(month: string, dayType: string, searchText: string, isToday: boolean = false, isTomorrow: boolean = false, isYesterday: boolean = false): Observable<any> {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('searchText', searchText)
      .set('month', month)
      .set('dayType', dayType)
      .set('isToday', isToday)
      .set('isTomorrow', isTomorrow)
      .set('isYesterday', isYesterday);
    return this.http.get(this.baseUrl + constants.DAYURL + 'getDayList', { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addDay(dayDetailsForm: any): Observable<any> {
    try {
      const url = this.baseUrl + constants.DAYURL + 'addDay?userId=';
      return this.http.post(url + Number(localStorage.getItem("userId")), dayDetailsForm);
    }
    catch (exception) {
      return this.http.post(this.baseUrl + constants.DAYURL + 'addDay?userId=' + Number(localStorage.getItem("userId")), dayDetailsForm);
    }
  }

  updateDay(dayDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.DAYURL + 'updateDay?userId=' + Number(localStorage.getItem("userId")), dayDetailsForm);
  }

  uploadImage(assetId: number, documentType: string, dayDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.ASSETURL + 'UploadAndSaveFile?userId=' + Number(localStorage.getItem("userId")) + '&assetId=' + assetId + '&documentType=' + documentType, dayDetailsForm);
  }

  deleteDay(dayId: number): Observable<any> {

    return this.http.get(this.baseUrl + constants.DAYURL + 'deleteDay?dayId=' + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  approveDay(dayId: number): Observable<any> {

    return this.http.get(this.baseUrl + constants.DAYURL + 'approveDay?dayId=' + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

}
