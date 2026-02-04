import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { Observable } from 'rxjs';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Routine } from '../../interfaces/routine';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  loggedInUserId: string;

  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }
  // =========================
  // GET routine by user
  // =========================
  getRoutineByUser() {
    const userId = localStorage.getItem(LocalStorageConstants.USERID);
    return this.http.get<Routine[]>(
      API_URL.GET_ROUTINE_BY_USER + userId
    );
  }

  // =========================
  // ADD routine
  // =========================
  addRoutine(data: Routine) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.post<string>(API_URL.ADD_ROUTINE, data);
  }

  // =========================
  // UPDATE routine
  // =========================
  updateRoutine(data: Routine) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.put(
      API_URL.UPDATE_ROUTINE,
      data
    );
  }

  // =========================
  // GET routine details
  // =========================
  getRoutineDetails(routineId: string) {
    return this.http.get<Routine>(
      API_URL.UPDATE_ROUTINE + routineId
    );
  }

      // =========================
  // GET routine details
  // =========================
  deleteRoutine(routineId: string) {
    return this.http.get<boolean>(
      API_URL.DELETE_ROUTINE + routineId+'&userId='+this.loggedInUserId
    );
  }

  //  getRoutine(userId: string) {
  //   const params = new HttpParams()
  //     .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
  //   return this.http.get<Routine[]>(API_URL.GET_ROUTINE, { params: params });
  // }

  // saveRoutine(data: Routine) {
  //   return this.http.post(API_URL.ADD_ROUTINE + String(localStorage.getItem(LocalStorageConstants.USERID)), data);
  // }
  
}