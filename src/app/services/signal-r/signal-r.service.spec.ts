import { TestBed } from '@angular/core/testing';
import { SignalRService } from './signal-r.service';
import { ChatService } from '../chat/chat.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import * as signalR from '@microsoft/signalr';
import { API_URL } from '../../utils/api-url';

describe('SignalRService', () => {
  let service: SignalRService;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockHubConnectionBuilder: jasmine.SpyObj<signalR.HubConnectionBuilder>;
  let mockHubConnection: jasmine.SpyObj<signalR.HubConnection>;

  beforeEach(() => {
    mockChatService = jasmine.createSpyObj('ChatService', ['']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getLoggedInUserData']);
    mockHubConnection = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'on', 'invoke']);

    mockLocalStorageService.getLoggedInUserData.and.returnValue({ userId: '905703c5-6929-411e-a2ab-860f982690f9' });
 // Mock HubConnectionBuilder
 mockHubConnectionBuilder = jasmine.createSpyObj('HubConnectionBuilder', ['withUrl', 'build']);
 mockHubConnectionBuilder.withUrl.and.returnValue(mockHubConnectionBuilder); // Chainable method
 mockHubConnectionBuilder.build.and.returnValue(mockHubConnection); // Returns the mock connection

    TestBed.configureTestingModule({
      providers: [
        SignalRService,
        { provide: ChatService, useValue: mockChatService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: signalR.HubConnectionBuilder, useValue: mockHubConnectionBuilder }
      ]
    });

    service = TestBed.inject(SignalRService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the hub connection with correct URL', () => {
    mockLocalStorageService.getLoggedInUserData.and.returnValue({ userId: '123' });

    // Instantiate the service to trigger the constructor logic
    service = new SignalRService(mockChatService, mockLocalStorageService);

    // Verify that withUrl method was called on HubConnectionBuilder
    expect(mockHubConnectionBuilder.withUrl).toHaveBeenCalledWith(
      API_URL.CHAT_URL + '?userId=123',
      jasmine.any(Object) // Adjust the second parameter as needed
    );
    expect(mockHubConnectionBuilder.build).toHaveBeenCalled();
  });

  // it('should start connection on constructor call if userId exists', () => {
  //   expect(mockHubConnection.start).toHaveBeenCalled();
  // });

  // it('should close connection when hub connection is closed', async () => {
  //   await service.closeConnection();
  //   expect(mockHubConnection.stop).toHaveBeenCalled();
  // });

  // it('should handle user list on "ReceiveUserList" event', async () => {
  //   const userList: ChatUser[] = [{
  //     id: '1', userName: 'Jane Doe',
  //     email: '',
  //     role: '',
  //     unreadMessageCount: 0,
  //     lastMessage: '',
  //     lastMessageTypeId: MessageType.Text,
  //     lastMessageSender: '',
  //     lastMessageStatus: false,
  //     lastMessageTime: new Date()
  //   }];
  //   mockHubConnection.on.calls.argsFor(0)[1](userList); // simulate "ReceiveUserList" event
  //   expect(service.userList$.getValue()).toEqual(userList);
  // });

  // it('should handle notification count on "NotificationCount" event', () => {
  //   const count = 5;
  //   mockHubConnection.on.calls.argsFor(1)[1](count); // simulate "NotificationCount" event
  //   expect(service.unreadMessageCount$.getValue()).toBe(count);
  // });

  // it('should handle message sent on "MessageSent" event', () => {
  //   const message: ChatMessage = { senderId: '1', receiverId: '2', message: 'Hello', messageTypeId: service.messageType, createdOn: new Date(), isMessageRead: false };
  //   const userList: ChatUser[] = [{
  //     id: '1', userName: 'Jane Doe',
  //     email: '',
  //     role: '',
  //     unreadMessageCount: 0,
  //     lastMessage: '',
  //     lastMessageTypeId: MessageType.Text,
  //     lastMessageSender: '',
  //     lastMessageStatus: false,
  //     lastMessageTime: new Date()
  //   }];
  //   mockHubConnection.on.calls.argsFor(2)[1](message, userList); // simulate "MessageSent" event
  //   expect(service.MessageSent$.getValue()).toBe(message);
  //   expect(service.userList$.getValue()).toEqual(userList);
  // });

  // it('should handle message received on "MessageReceived" event', () => {
  //   const message: ChatMessage = { senderId: '2', receiverId: '1', message: 'Hi', messageTypeId: service.messageType, createdOn: new Date(), isMessageRead: false };
  //   const userList: ChatUser[] = [{
  //     id: '2', userName: 'Jane Doe',
  //     email: '',
  //     role: '',
  //     unreadMessageCount: 0,
  //     lastMessage: '',
  //     lastMessageTypeId: MessageType.Text,
  //     lastMessageSender: '',
  //     lastMessageStatus: false,
  //     lastMessageTime: new Date()
  //   }];
  //   mockHubConnection.on.calls.argsFor(3)[1](message, userList); // simulate "MessageReceived" event
  //   expect(service.MessageReceived$.getValue()).toBe(message);
  //   expect(service.userList$.getValue()).toEqual(userList);
  // });

  // it('should handle message opened on "MessageOpened" event', () => {
  //   const chatHistory: ChatMessage[] = [{ senderId: '1', receiverId: '2', message: 'Hello', messageTypeId: service.messageType, createdOn: new Date(), isMessageRead: false }];
  //   const userList: ChatUser[] = [{
  //     id: '1', userName: 'John Doe',
  //     email: '',
  //     role: '',
  //     unreadMessageCount: 0,
  //     lastMessage: '',
  //     lastMessageTypeId: MessageType.Text,
  //     lastMessageSender: '',
  //     lastMessageStatus: false,
  //     lastMessageTime: new Date()
  //   }];
  //   mockHubConnection.on.calls.argsFor(4)[1](chatHistory, userList); // simulate "MessageOpened" event
  //   expect(service.chatHistory$.getValue()).toEqual(chatHistory);
  //   expect(service.userList$.getValue()).toEqual(userList);
  // });

  // it('should retry startConnection when start fails', async () => {
  //   mockHubConnection.start.and.returnValue(Promise.reject('Error'));
  //   const spy = spyOn(service, 'startConnection').and.callThrough();
  //   await service.startConnection('123');
  //   expect(spy).toHaveBeenCalledTimes(2); // should be called twice (retry)
  // });

  // it('should invoke GetUserList and retry on failure', async () => {
  //   mockHubConnection.invoke.and.throwError('Error');
  //   const spy = spyOn(service, 'getUserList').and.callThrough();
  //   await service.getUserList();
  //   expect(spy).toHaveBeenCalledTimes(2); // should be called twice (retry)
  // });

  // it('should invoke GetNotificationCountForUnreadChats and retry on failure', async () => {
  //   mockHubConnection.invoke.and.throwError('Error');
  //   const spy = spyOn(service, 'getUnreadChatCountForNotification').and.callThrough();
  //   await service.getUnreadChatCountForNotification();
  //   expect(spy).toHaveBeenCalledTimes(2); // should be called twice (retry)
  // });

  // it('should invoke SendChatMessage and retry on failure', async () => {
  //   const chatMessage: AddChatDto = { receiverId: '2', message: 'Test', messageTypeId: service.messageType };
  //   mockHubConnection.invoke.and.throwError('Error');
  //   const spy = spyOn(service, 'sendMessage').and.callThrough();
  //   await service.sendMessage(chatMessage);
  //   expect(spy).toHaveBeenCalledTimes(2); // should be called twice (retry)
  // });

  // it('should invoke MessageOpened and retry on failure', async () => {
  //   mockHubConnection.invoke.and.throwError('Error');
  //   const spy = spyOn(service, 'messageOpened').and.callThrough();
  //   await service.messageOpened('1', '2');
  //   expect(spy).toHaveBeenCalledTimes(2); // should be called twice (retry)
  // });

});
