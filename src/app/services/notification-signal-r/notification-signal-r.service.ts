import { HostListener, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationSignalRService {
  private hubConnection: signalR.HubConnection;
  
  public NotificationReceived$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private startConnectionCount = 0;

  constructor(
    private localStorageService: LocalStorageService
  ) {
    
    
    
    const loggedInUser = localStorageService.getLoggedInUserData();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(API_URL.NOTIFICATION_URL + '?userId=' + loggedInUser?.userId)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(() => {
      this.closeConnection();
    });

    if (loggedInUser?.userId) {
      this.startConnection(loggedInUser?.userId);
    }
  }

  async startConnection(userId: string = '') {
    if (!this.hubConnection.connectionId) {
      if (userId === '') {
        userId = this.localStorageService.getLoggedInUserData()?.userId;
      }
      this.hubConnection
        .start()
        .then(() =>
          console.log('Notification Hub Connection started')
        )
        .catch((err) => {
          if (this.startConnectionCount < 5) {
            this.startConnectionCount++;
            console.log(
              'Error while starting notification signalr connection retrying in 5 seconds: ' + err
            );
            setTimeout(() => this.startConnection(userId), 5000); 
          }
        });
    }
    
    this.hubConnection.on('NotificationReceived', (message) => {
      this.NotificationReceived$.next(message);
    });
  }

  
  @HostListener('window:beforeunload', ['$event'])
  async closeConnection() {
    await this.hubConnection.stop();
  }
}