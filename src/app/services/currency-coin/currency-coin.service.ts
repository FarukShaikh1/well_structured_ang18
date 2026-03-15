import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { CoinNoteCollectionRequest } from '../../interfaces/coin-note-collection-request';
@Injectable({
  providedIn: 'root'
})
export class CurrencyCoinService {

  constructor(private http: HttpClient) { }


  getCurrencyCoinList(): Observable<any> {
    if (localStorage.getItem(LocalStorageConstants.USERID) !== null) {
      const params = new HttpParams()
      return this.http.get(API_URL.GET_COLLECTION_COIN_GALLERY, { params: params });
    }
    return this.http.get(API_URL.GET_COLLECTION_COIN_GALLERY);
  }
  getCurrencyCoinRecords(countryId: number = 0): Observable<any> {
    if (localStorage.getItem(LocalStorageConstants.USERID) !== null && localStorage.getItem(LocalStorageConstants.USERID) !== undefined  && localStorage.getItem(LocalStorageConstants.USERID) !== 'undefined') {
      const params = new HttpParams()
        .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
        .set('countryId', String(countryId))
      return this.http.get(API_URL.GET_COLLECTION_COIN_LIST, { params: params });
    } else {
      return this.http.get(API_URL.GET_COLLECTION_COIN_LIST);
    }
  }

  getCurrencyCoinSummary(): Observable<any> {
    if (localStorage.getItem(LocalStorageConstants.USERID) !== null) {
      const params = new HttpParams()
        .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
      return this.http.get(API_URL.GET_COLLECTION_SUMMARY, { params: params });
    }
    else {
      return this.http.get(API_URL.GET_COLLECTION_SUMMARY);
    }
  }
  getCurrencyCoinDetails(collectionCoinId: string) {
      const params = new HttpParams()
      return this.http.get(API_URL.GET_COLLECTION_COIN_DETAILS+collectionCoinId);
  }

  addCurrencyCoin(coinNoteCollectionRequest: CoinNoteCollectionRequest): Observable<any> {
    return this.http.post(API_URL.ADD_COLLECTION_COIN, coinNoteCollectionRequest);
  }

  updateCurrencyCoin(coinNoteCollectionRequest: CoinNoteCollectionRequest): Observable<any> {
    return this.http.put(API_URL.UPDATE_COLLECTION_COIN, coinNoteCollectionRequest);
  }

  deleteCurrencyCoin(coinId: string): Observable<any> {
    return this.http.delete(API_URL.DELETE_COLLECTION_COIN + coinId);
  }

  approveCurrencyCoin(coinNoteCollectionId: string): Observable<any> {
    return this.http.get(API_URL.APPROVE_COLLECTION_COIN + coinNoteCollectionId);
  }
}
