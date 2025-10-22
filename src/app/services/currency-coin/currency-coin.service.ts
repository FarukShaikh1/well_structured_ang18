import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { CoinNoteCollectionRequest } from '../../interfaces/coin-note-collection-request';
import { LocalStorageConstants } from '../../../utils/application-constants';
@Injectable({
  providedIn: 'root'
})
export class CurrencyCoinService {

  constructor(private http: HttpClient) { }


  getCurrencyCoinList(): Observable<any> {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
    return this.http.get(API_URL.GET_COLLECTION_COIN_GALLERY, { params: params });
  }
  getCurrencyCoinRecords(countryId: number = 0): Observable<any> {

    const params = new HttpParams()
      .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
      .set('countryId', String(countryId))
    return this.http.get(API_URL.GET_COLLECTION_COIN_LIST, { params: params });
  }

  getCurrencyCoinSummary(): Observable<any> {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
    return this.http.get(API_URL.GET_COLLECTION_SUMMARY, { params: params });
  }

  getCurrencyCoinDetails(collectionCoinId: string) {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
      .set('coinNoteCollectionId', collectionCoinId)
    return this.http.get(API_URL.GET_COLLECTION_COIN_DETAILS, { params: params })

  }

  addCurrencyCoin(coinNoteCollectionRequest: CoinNoteCollectionRequest): Observable<any> {
    return this.http.post(API_URL.ADD_COLLECTION_COIN + String(localStorage.getItem(LocalStorageConstants.USERID)), coinNoteCollectionRequest);
  }

  updateCurrencyCoin(coinNoteCollectionRequest: CoinNoteCollectionRequest): Observable<any> {
    return this.http.post(API_URL.UPDATE_COLLECTION_COIN + String(localStorage.getItem(LocalStorageConstants.USERID)), coinNoteCollectionRequest);
  }

  deleteCurrencyCoin(dayId: string): Observable<any> {
    return this.http.get(API_URL.DELETE_COLLECTION_COIN + dayId + '&userId=' + String(localStorage.getItem(LocalStorageConstants.USERID)));
  }
}
