import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRequest as ConfigRequest } from '../../interfaces/account-request';
import { API_URL } from '../../../utils/api-url';
import { OccasionTypeResponse } from '../../interfaces/occasion-type-response';
import { OccasionTypeRequest } from '../../interfaces/occasion-type-request';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private base = '/api/accounts';

  constructor(private http: HttpClient) { }

  getAccounts(userId: string) {
    return this.http.get(API_URL.GET_ACCOUNT_LIST + userId);
  }

  getConfigDetailsById(config: string='', id: string='') {
    if (config == 'account')
      return this.http.get(API_URL.GET_ACCOUNT_DETAILS + id);
    if (config == 'relaton')
      return this.http.get(API_URL.GET_RELATION_DETAILS + id);
    if (config == 'occasiontype')
      return this.http.get(API_URL.GET_OCCASION_TYPE_DETAILS + id);
    return this.http.get(API_URL.GET_ACCOUNT_LIST + id);
  }

  addAccount(config: ConfigRequest) {
    return this.http.post(this.base, config);
  }
  updateAccount(account: ConfigRequest) {
    return this.http.post(this.base, account);
  }
  deleteAccount(id: string) {
    return this.http.get(API_URL.GET_ACCOUNT_LIST + String(localStorage.getItem("userId")));
  }

  getOccasionTypes(userId: string) {
    return this.http.get(API_URL.GET_OCCASION_TYPE_LIST + userId);
  }

  addOccasionType(account: OccasionTypeRequest) {
    return this.http.post(this.base, account);
  }
  updateOccasionType(account: OccasionTypeRequest) {
    return this.http.post(this.base, account);
  }
  deleteOccasionType(id: string) {
    return this.http.get(API_URL.GET_ACCOUNT_LIST + String(localStorage.getItem("userId")));
  }



  getRelationTypes(userId: string) {
    return this.http.get(API_URL.GET_RELATION_LIST + userId);
  }


  addRelationType(account: any) {
    return this.http.post(this.base, account);
  }
  updateRelationType(account: any) {
    return this.http.post(this.base, account);
  }
  deleteRelationType(id: string) {
    return this.http.get(API_URL.GET_ACCOUNT_LIST + String(localStorage.getItem("userId")));
  }
  // Add edit/delete as needed
}
