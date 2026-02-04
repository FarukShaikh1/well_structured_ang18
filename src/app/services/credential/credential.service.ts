import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { Observable } from 'rxjs';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Credential } from '../../interfaces/credential';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  loggedInUserId: string;

  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }
  // =========================
  // GET credential by user
  // =========================
  getCredentialByUser() {
    const userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString();
    return this.http.get<Credential[]>(
      API_URL.GET_CREDENTIAL_BY_USER + userId
    );
  }

  // =========================
  // ADD credential
  // =========================
  addCredential(data: Credential) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.post<string>(API_URL.ADD_CREDENTIAL, data);
  }

  // =========================
  // UPDATE credential
  // =========================
  updateCredential(data: Credential) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.put(
      API_URL.UPDATE_CREDENTIAL,
      data
    );
  }

  // =========================
  // GET credential details
  // =========================
  getCredentialDetails(credentialId: string) {
    return this.http.get<Credential>(
      API_URL.GET_CREDENTIAL_DETAILS + credentialId
    );
  }

    // =========================
  // GET credential details
  // =========================
  deleteCredential(credentialId: string) {
    return this.http.get<boolean>(
      API_URL.DELETE_CREDENTIAL + credentialId+'&userId='+this.loggedInUserId
    );
  }

  //  getCredential(userId: string) {
  //   const params = new HttpParams()
  //     .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
  //   return this.http.get<Credential[]>(API_URL.GET_CREDENTIAL, { params: params });
  // }

  // saveCredential(data: Credential) {
  //   return this.http.post(API_URL.ADD_CREDENTIAL + String(localStorage.getItem(LocalStorageConstants.USERID)), data);
  // }
  
}