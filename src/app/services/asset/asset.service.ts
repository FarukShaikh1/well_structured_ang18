import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as constants from '../../../utils/constants';
import { environmentDev } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  baseUrl = environmentDev.serverUrl;
  loggedInUserId: number;

  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getAssetDetails(assetId: number) {
    const params = new HttpParams()
      .set('userid', Number(localStorage.getItem("userId")))
      .set('assetId', assetId)
    return this.http.get(this.baseUrl + constants.ASSETURL + 'getAssetDetail', { params: params })

  }

}