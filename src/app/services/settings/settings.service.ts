import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }
  loggedInUserId: number;

  getExpenseDetails(expenseId: number) {
    const params = new HttpParams()
      .set('userid', this.loggedInUserId)
      .set('expenseId', expenseId)
    return this.http.get(API_URL.GET_EXPENSE_DETAILS, { params: params })

  }


  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.ADD_EXPENSE + this.loggedInUserId, expenseDetailsForm);
  }

}
