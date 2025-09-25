import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { AddChatDto, MessageType } from '../../interfaces/add-chat-dto';
import * as signalR from '@microsoft/signalr';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { API_URL } from '../../utils/api-url';
import { ChatUser } from '../../interfaces/chat-user';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public messageType!: MessageType;
  public chatMessage: ChatMessage = {
    senderId: '',
    receiverId: '',
    message: '',
    messageTypeId: this.messageType,
    createdOn: new Date(),
    isMessageRead: false,
  };
  public MessageSent$: BehaviorSubject<ChatMessage> =
    new BehaviorSubject<ChatMessage>(this.chatMessage);
  public MessageReceived$: BehaviorSubject<ChatMessage> =
    new BehaviorSubject<ChatMessage>(this.chatMessage);
  public userList$: BehaviorSubject<ChatUser[]> = new BehaviorSubject<
    ChatUser[]
  >([]);
  public chatHistory$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<
    ChatMessage[]
  >([]);
  public unreadMessageCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  public senderId: string = '';
  public receiverId: string = '';
  public message: string = '';
  public type = 'Text';
  public chatHistory: ChatMessage[] = [];
  public isDocumentUploaded = new BehaviorSubject<any>(null);
  private startConnectionCount = 0;
  private GetNotificationCount = 0;

  constructor(
    private chatService: ChatService,
    private localStorageService: LocalStorageService
  ) {
    const loggedInUser = localStorageService.getLoggedInUserData();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(API_URL.CHAT_URL + '?userId=' + loggedInUser?.userId)
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
          console.log(
            'Hub Connection started, connectionId is :',
            this.hubConnection.connectionId,
            '      and userId is : ',
            userId
          )
        )
        .catch((err) => {
          if (this.startConnectionCount < 5) {
            this.startConnectionCount++;
            console.log(
              'Error while starting connection retrying in 5 seconds: ' + err
            );
            setTimeout(() => this.startConnection(userId), 5000); 
          }
        });
    }

    
    this.hubConnection.on('ReceiveUserList', (userList: any) => {
      this.userList$.next(userList); 
    });

    
    this.hubConnection.on('NotificationCount', (count) => {
      this.unreadMessageCount$.next(count); 
    });

    
    this.hubConnection.on('MessageSent', (message, userList) => {
      this.MessageSent$.next(message);
      this.userList$.next(userList);
    });

    
    this.hubConnection.on('MessageReceived', (message, userList) => {
      this.MessageReceived$.next(message);
      this.userList$.next(userList);
    });

    
    this.hubConnection.on('MessageOpened', (chatHistory, userList) => {
      this.chatHistory$.next(chatHistory); 
      this.userList$.next(userList); 
    });
  }

  
  @HostListener('window:beforeunload', ['$event'])
  async closeConnection() {
    await this.hubConnection.stop();
  }

  
  async getUserList() {
    if (!this.hubConnection.connectionId) {
      await this.startConnection('');
    }
    try {
      await this.hubConnection.invoke(
        'GetUserList',
        this.localStorageService.getLoggedInUserData().userId
      );
    } catch (error) {
      if (this.startConnectionCount < 5) {
        this.startConnectionCount++;
        setTimeout(() => this.getUserList(), 5000); 
      }
    }
  }

  async getUnreadChatCountForNotification() {
    if (!this.hubConnection.connectionId) {
      await this.startConnection('');
    }
    try {
      await this.hubConnection.invoke(
        'GetNotificationCountForUnreadChats',
        this.localStorageService.getLoggedInUserData()?.userId
      );
    } catch (error) {
      if (this.GetNotificationCount < 5) {
        this.GetNotificationCount++;
        setTimeout(() => this.getUnreadChatCountForNotification(), 3000); 
      }
    }
  }

  async sendMessage(chatMessage: AddChatDto) {
    if (
      !chatMessage.receiverId ||
      !chatMessage.message ||
      !chatMessage.messageTypeId
    ) {
      return;
    }

    if (!this.hubConnection.connectionId) {
      await this.startConnection('');
    }
    try {
      await this.hubConnection.invoke(
        'SendChatMessage',
        chatMessage,
        this.localStorageService.getLoggedInUserData().userId
      );
    } catch (error) {
      
    }
    this.message = '';
  }

  
  async messageOpened(userId: string, openedByUserId: string) {
    if (!this.hubConnection.connectionId) {
      await this.startConnection('');
    }
    try {
      await this.hubConnection.invoke('MessageOpened', userId, openedByUserId);
    } catch (error) {
      setTimeout(() => this.messageOpened(userId, openedByUserId), 5); 
    }
  }
}
export { ChatMessage };
