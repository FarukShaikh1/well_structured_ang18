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
    return this.http.get(API_URL.GET_COLLECTION_COIN_LIST);
  }

  getCurrencyCoinSummary(): Observable<any> {
    return this.http.get(API_URL.GET_COLLECTION_SUMMARY);
  }

  getCurrencyCoinDetails(collectionCoinId: string) {
    return this.http.get(API_URL.GET_COLLECTION_COIN_DETAILS + collectionCoinId);
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
