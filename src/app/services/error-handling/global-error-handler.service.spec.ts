import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandlerService } from './global-error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandlerService],
    });
    service = TestBed.inject(GlobalErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log and alert on error (string)', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    const error = 'Test error';

    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred:', error);
    expect(window.alert).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred: ' + error);
  });

  it('should log and alert on error (Error object)', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    const error = new Error('Test error object');

    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred:', error);
    expect(window.alert).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred: ' + error);
  });

  it('should log and alert on error (Custom object)', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    const error = { message: 'Test custom error object' };

    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred:', error);
    expect(window.alert).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred: ' + error);
  });

  it('should handle null or undefined errors gracefully', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    service.handleError(null);
    service.handleError(undefined);

    expect(console.error).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred:', null);
    expect(console.error).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred:', undefined);
    expect(window.alert).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred: ' + null);
    expect(window.alert).toHaveBeenCalledWith('GlobalErrorHandlerService: An error occurred: ' + undefined);
  });
});
