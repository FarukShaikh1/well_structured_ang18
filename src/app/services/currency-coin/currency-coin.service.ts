import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as constants from '../../../utils/constants';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.dev';
@Injectable({
  providedIn: 'root'
})
export class CurrencyCoinService {
  baseUrl = environmentDev.serverUrl;

  constructor(private http: HttpClient) { }


  getCurrencyCoinList(): Observable<any> {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
    return this.http.get(this.baseUrl + constants.CURRENCYCOINURL + 'CollectionGallery', { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }
  getCurrencyCoinRecords(): Observable<any> {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
    return this.http.get(this.baseUrl + constants.CURRENCYCOINURL + 'LoadCollectionRecords', { params: params });//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  getCurrencyCoinDetails(collectionCoinId: number) {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('collectionCoinId', collectionCoinId)
    return this.http.get(this.baseUrl + constants.CURRENCYCOINURL + 'getCurrencyCoinDetails', { params: params })

  }

  addCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.CURRENCYCOINURL + 'addCurrencyCoin?userId=' + Number(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  updateCurrencyCoin(currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.CURRENCYCOINURL + 'updateCurrencyCoin?userId=' + Number(localStorage.getItem("userId")), currencyCoinDetailsForm);
  }

  uploadImage(assetId: number, documentType: string, currencyCoinDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.ASSETURL + 'UploadAndSaveFile?userId=' + Number(localStorage.getItem("userId")) + '&assetId=' + assetId + '&documentType=' + documentType, currencyCoinDetailsForm);
  }

  daleteCurrencyCoin(dayId: number): Observable<any> {
    return this.http.get(this.baseUrl + constants.CURRENCYCOINURL + 'daleteCurrencyCoin?dayId=' + dayId + '&userId=' + Number(localStorage.getItem("userId")));
  }

}
