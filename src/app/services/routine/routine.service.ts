import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Routine } from '../../interfaces/routine';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {

  constructor(private http: HttpClient) {
  }
  // =========================
  // GET routine by user
  // =========================
  getRoutineByUser() {
    return this.http.get<Routine[]>(
      API_URL.GET_ROUTINE_BY_USER
    );
  }

  // =========================
  // ADD routine
  // =========================
  addRoutine(data: Routine) {
    return this.http.post<string>(API_URL.ADD_ROUTINE, data);
  }

  // =========================
  // UPDATE routine
  // =========================
  updateRoutine(data: Routine) {
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
    return this.http.delete<boolean>(
      API_URL.DELETE_ROUTINE + routineId
    );
  }
}