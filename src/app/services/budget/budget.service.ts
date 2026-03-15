import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { Observable } from 'rxjs';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Budget } from '../../interfaces/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  loggedInUserId: string;

  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }
  // =========================
  // GET budget by user
  // =========================
  getBudgetByUser() {
    const userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString();
    return this.http.get<Budget[]>(
      API_URL.GET_BUDGET_BY_USER
    );
  }

  // =========================
  // ADD budget
  // =========================
  addBudget(data: Budget) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.post<string>(API_URL.ADD_BUDGET, data);
  }

  // =========================
  // UPDATE budget
  // =========================
  updateBudget(data: Budget) {
    data.userId = localStorage.getItem(LocalStorageConstants.USERID)!;
    return this.http.put(
      API_URL.UPDATE_BUDGET,
      data
    );
  }

  // =========================
  // GET budget details
  // =========================
  getBudgetDetails(budgetId: string) {
    return this.http.get<Budget>(
      API_URL.GET_BUDGET_DETAILS + budgetId
    );
  }

    // =========================
  // GET budget details
  // =========================
  deleteBudget(budgetId: string) {
    return this.http.get<boolean>(
      API_URL.DELETE_BUDGET + budgetId+'&userId='+this.loggedInUserId
    );
  }

  //  getBudget(userId: string) {
  //   const params = new HttpParams()
  //     .set('userid', String(localStorage.getItem(LocalStorageConstants.USERID)))
  //   return this.http.get<Budget[]>(API_URL.GET_BUDGET, { params: params });
  // }

  // saveBudget(data: Budget) {
  //   return this.http.post(API_URL.ADD_BUDGET + String(localStorage.getItem(LocalStorageConstants.USERID)), data);
  // }
  
}