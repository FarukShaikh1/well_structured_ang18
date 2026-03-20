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

  constructor(private http: HttpClient) {
  }
  // =========================
  // GET budget by user
  // =========================
  getBudgetByUser() {
    return this.http.get<Budget[]>(
      API_URL.GET_BUDGET_BY_USER
    );
  }

  // =========================
  // ADD budget
  // =========================
  addBudget(data: Budget) {
    return this.http.post<string>(API_URL.ADD_BUDGET, data);
  }

  // =========================
  // UPDATE budget
  // =========================
  updateBudget(data: Budget) {
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
    return this.http.delete<boolean>(
      API_URL.DELETE_BUDGET + budgetId
    );
  }  
}