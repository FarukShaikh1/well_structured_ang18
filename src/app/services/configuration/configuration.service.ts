import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../../../utils/api-url';
import { ConfigurationRequest } from '../../interfaces/configuration-request';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private base = '/api/accounts';

  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem("userId"));
  }

  getConfigList(userId: string = '', config: string = '') {
    const params = new HttpParams()
      .set('userId', userId)
      .set('config', config);
    return this.http.get(API_URL.GET_CONFIG_LIST, { params });
  }

  getConfigDetailsById( id: string = '',config: string = '') {
    const params = new HttpParams()
      .set('id', id)
      .set('config', config);
    return this.http.get(API_URL.GET_CONFIG_DETAIL, { params });
  }

  addConfiguration(request: ConfigurationRequest, config: string) {
    debugger;
    const params = new HttpParams()
      .set('userId', this.loggedInUserId)
      .set('config', config);
    return this.http.post(API_URL.GET_CONFIG_ADD, request, { params });
  }

  updateConfiguration(request: ConfigurationRequest, config: string) {
    debugger;
    const params = new HttpParams()
      .set('userId', this.loggedInUserId)
      .set('config', config);
    return this.http.post(API_URL.GET_CONFIG_UPDATE, request, { params });
  }

  deleteConfiguration(id: string, config: string) {
    const params = new HttpParams()
      .set('id', id)
      .set('userId', this.loggedInUserId)
      .set('config', config);
    return this.http.get(API_URL.GET_CONFIG_DELETE, { params });
  }

}
