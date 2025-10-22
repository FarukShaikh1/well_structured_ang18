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
 
 mockHubConnectionBuilder = jasmine.createSpyObj('HubConnectionBuilder', ['withUrl', 'build']);
 mockHubConnectionBuilder.withUrl.and.returnValue(mockHubConnectionBuilder); 
 mockHubConnectionBuilder.build.and.returnValue(mockHubConnection); 

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

    
    service = new SignalRService(mockChatService, mockLocalStorageService);

    
    expect(mockHubConnectionBuilder.withUrl).toHaveBeenCalledWith(
      API_URL.CHAT_URL + '?userId=123',
      jasmine.any(Object) 
    );
    expect(mockHubConnectionBuilder.build).toHaveBeenCalled();
  });

  
  
  

  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  
  
  
  

});
