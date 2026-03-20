import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { Observable } from 'rxjs';
import { LocalStorageConstants } from '../../../utils/application-constants';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) {
  }

  getAssetDetails(assetId: string) {
    return this.http.get(API_URL.GET_ASSET_DETAILS + assetId);
  }

  deleteAsset(assetId: string) {
    return this.http.delete(API_URL.DELETE_ASSET + assetId);
  }

  uploadImage(assetId: string, documentType: string, file: any): Observable<any> {

    if (assetId) {
      return this.http.post(API_URL.UPLOAD_IMAGE + "assetId=" + assetId + "&documentType=" + documentType, file);
    }
    else {
      return this.http.post(API_URL.UPLOAD_IMAGE + "documentType=" +
        documentType,
        file
      );
    }
  }
}