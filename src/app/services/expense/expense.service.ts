import { API_URL } from '../../../utils/api-url';
import { HttpService } from '../rest/http.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as constants from '../../../utils/constants';
// import { DataSource } from '@angular/cdk/collections';
import { environmentDev } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {
  baseUrl = environmentDev.serverUrl;

  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getExpenseDetails(expenseId: string) {
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('expenseId', expenseId)        
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getExpenseDetails',{params:params})
    
  }


    getExpenseSummaryList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
      modeOfTransaction:string): Observable<any> {
     const params=new HttpParams()
     .set('userid', this.loggedInUserId)
     .set('fromDate', fromDate)
     .set('toDate', toDate)
     .set('sourceOrReason',sourceOrReason)
     .set('minAmount', minAmount)
     .set('maxAmount', maxAmount)
     .set('modeOfTransaction', modeOfTransaction)

     return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getExpenseSummaryList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
   }
 
   getExpenseReportList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
    modeOfTransaction:string): Observable<any> {
   const params=new HttpParams()
   .set('userid', this.loggedInUserId)
   .set('fromDate', fromDate)
   .set('toDate', toDate)
   .set('sourceOrReason',sourceOrReason)
   .set('minAmount', minAmount)
   .set('maxAmount', maxAmount)
   .set('modeOfTransaction', modeOfTransaction)

   return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getExpenseReportList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
 }



   getExpenseList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
     modeOfTransaction:string): Observable<any> {
      debugger
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('fromDate', fromDate)
    .set('toDate', toDate)
    .set('sourceOrReason',sourceOrReason)
    .set('minAmount', minAmount)
    .set('maxAmount', maxAmount)
    .set('modeOfTransaction', modeOfTransaction)
    
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getExpenseList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.EXPENSEURL + 'addExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  adjustExpense(expenseAdjustmentForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.EXPENSEURL + 'expenseAdjustment?userId=' + this.loggedInUserId, expenseAdjustmentForm);
  }

  updateExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.EXPENSEURL + 'updateExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  deleteExpense(expenseId: string): Observable<any> {
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'deleteExpense?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  getSourceOrReasonList(fromDt:string='',toDt:string='',searchText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('fromDate', fromDt)
    .set('toDate', toDt)
    .set('searchText', searchText)
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'GetSourceOrReasonList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }

  getAvailAmount(onDate:string='',accountType:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('onDate', onDate)
    .set('accountType',accountType)
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'getAvailAmount',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }

  getDescriptionList(sourceText:string='',descriptionText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('sourceText', sourceText)
    .set('descriptionText', descriptionText)
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'GetDescriptionList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }
  getPurposeList(sourceText:string='',purposeText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('sourceText', sourceText)
    .set('purposeText', purposeText)
    return this.http.get(this.baseUrl + constants.EXPENSEURL + 'GetPurposeList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }

  exportGridToExcel(dataSource:any){
return this.http.get(this.baseUrl + constants.EXPENSEURL + 'DownloadExpenseList',{params:dataSource});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));
  }
}
