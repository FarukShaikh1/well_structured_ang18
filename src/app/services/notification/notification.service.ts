import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationUpdated = new Subject<void>();
  notificationUpdated$ = this.notificationUpdated.asObservable();

  private unreadNotificationCount = new BehaviorSubject<number>(0);
  unreadNotificationCount$ = this.unreadNotificationCount.asObservable();

  constructor(private httpService: HttpService) { }

  notifyNotificationUpdate() {
    this.notificationUpdated.next();
  }

  updateUnreadNotificationCount(count: number) {
    this.unreadNotificationCount.next(count);
  }

  getAllNotifications(pageNo: number, pageSize: number): Observable<any> {
    // return this.httpService.get(API_URL.GET_ALL_SYSTEM_NOTIFICATIONS + `${pageNo}&pagesize=${pageSize}`);
    return this.httpService.get(API_URL.GET_ALL_ROLES + `${pageNo}&pagesize=${pageSize}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    // return this.httpService.patch(API_URL.MARK_A_SYSTEM_NOTIFICATION_AS_READ + `${notificationId}`, {});
    return this.httpService.patch(API_URL.GET_ALL_ROLES + `${notificationId}`, {});
  }

}
