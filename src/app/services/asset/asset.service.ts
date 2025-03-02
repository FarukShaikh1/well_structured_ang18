import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  loggedInUserId: string;

  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem("userId"));
  }

  getAssetDetails(assetId: string) {
    const params = new HttpParams()
      .set('userid', String(localStorage.getItem("userId")))
      .set('assetId', assetId)
    return this.http.get(API_URL.GET_ASSET_DETAILS, { params: params })

  }

}