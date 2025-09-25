import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../local-storage/local-storage.service';
import * as signalR from '@microsoft/signalr';
import { API_URL } from '../../../utils/api-url';

describe('SignalRService', () => {
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockHubConnectionBuilder: jasmine.SpyObj<signalR.HubConnectionBuilder>;
  let mockHubConnection: jasmine.SpyObj<signalR.HubConnection>;

  beforeEach(() => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getLoggedInUserData']);
    mockHubConnection = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'on', 'invoke']);

    mockLocalStorageService.getLoggedInUserData.and.returnValue({ userId: '905703c5-6929-411e-a2ab-860f982690f9' });
    
    mockHubConnectionBuilder = jasmine.createSpyObj('HubConnectionBuilder', ['withUrl', 'build']);
    mockHubConnectionBuilder.withUrl.and.returnValue(mockHubConnectionBuilder); 
    mockHubConnectionBuilder.build.and.returnValue(mockHubConnection); 

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: signalR.HubConnectionBuilder, useValue: mockHubConnectionBuilder }
      ]
    });

  });

  it('should create the service', () => {
  });

  it('should initialize the hub connection with correct URL', () => {
    mockLocalStorageService.getLoggedInUserData.and.returnValue({ userId: '123' });

    

    
    expect(mockHubConnectionBuilder.withUrl).toHaveBeenCalledWith(
      API_URL.CHAT_URL + '?userId=123',
      jasmine.any(Object) 
    );
    expect(mockHubConnectionBuilder.build).toHaveBeenCalled();
  });

  
  
  

  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  
  
  
  

});
