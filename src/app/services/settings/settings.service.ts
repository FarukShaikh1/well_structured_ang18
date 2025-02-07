import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as constants from '../../../utils/constants';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  baseUrl = environmentDev.serverUrl;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }
    loggedInUserId: number;

    getExpenseDetails(expenseId: number) {
      const params=new HttpParams()
      .set('userid', this.loggedInUserId)
      .set('expenseId', expenseId)        
      return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getExpenseDetails',{params:params})
      
    }

    
  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.EXPENSEURL + 'addExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  }
