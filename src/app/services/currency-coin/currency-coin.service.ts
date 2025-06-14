import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
@Injectable({
  providedIn: 'root'
})
export class CurrencyCoinService {

  constructor(private http: HttpClient) { }


  getCurrencyCoinList(): Observable<any> {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem("userId")))
    return this.http.get(API_URL.GET_COLLECTION_COIN_GALLERY, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }
  getCurrencyCoinRecords(countryId: number = 0): Observable<any> {

    const params = new HttpParams()
      .set('userid', String(localStorage.getItem("userId")))
      .set('countryId', String(countryId))
    return this.http.get(API_URL.GET_COLLECTION_COIN_LIST, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getCurrencyCoinSummary(): Observable<any> {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem("userId")))
    return this.http.get(API_URL.GET_COLLECTION_SUMMARY, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getCurrencyCoinDetails(collectionCoinId: string) {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem("userId")))
      .set('collectionCoinId', collectionCoinId)
    return this.http.get(API_URL.GET_COLLECTION_COIN_DETAILS, { params: params })

  }

  addCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.ADD_COLLECTION_COIN + String(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  updateCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPDATE_COLLECTION_COIN + String(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  uploadImage(assetId: string, documentType: string, currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPLOAD_IMAGE + String(localStorage.getItem("userId")) + '&assetId=' + assetId + '&documentType=' + documentType, currencyCoinDetailsForm);
  }

  deleteCurrencyCoin(dayId: string): Observable<any> {
    return this.http.get(API_URL.DELETE_COLLECTION_COIN + dayId + '&userId=' + String(localStorage.getItem("userId")));
  }

}
