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
      .set('userid', Number(localStorage.getItem("userId")))
    return this.http.get(API_URL.GET_COLLECTION_COIN_GALLERY, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }
  getCurrencyCoinRecords(): Observable<any> {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
    return this.http.get(API_URL.GET_COLLECTION_COIN_LIST, { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getCurrencyCoinDetails(collectionCoinId: number) {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('collectionCoinId', collectionCoinId)
    return this.http.get(API_URL.GET_COLLECTION_COIN_DETAILS, { params: params })

  }

  addCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.ADD_COLLECTION_COIN + Number(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  updateCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPDATE_COLLECTION_COIN + Number(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  uploadImage(assetId: number, documentType: string, currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPLOAD_IMAGE + Number(localStorage.getItem("userId")) + '&assetId=' + assetId + '&documentType=' + documentType, currencyCoinDetailsForm);
  }

  daleteCurrencyCoin(dayId: number): Observable<any> {
    return this.http.get(API_URL.DELETE_COLLECTION_COIN + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

}
