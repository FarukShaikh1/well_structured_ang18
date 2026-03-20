import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Credential } from '../../interfaces/credential';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  constructor(private http: HttpClient) {
  }
  // =========================
  // GET credential by user
  // =========================
  getCredentialByUser() {
    return this.http.get<Credential[]>(
      API_URL.GET_CREDENTIAL_BY_USER 
    );
  }

  // =========================
  // ADD credential
  // =========================
  addCredential(data: Credential) {
    return this.http.post<string>(API_URL.ADD_CREDENTIAL, data);
  }

  // =========================
  // UPDATE credential
  // =========================
  updateCredential(data: Credential) {
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
    return this.http.delete<boolean>(
      API_URL.DELETE_CREDENTIAL + credentialId
    );
  }
}