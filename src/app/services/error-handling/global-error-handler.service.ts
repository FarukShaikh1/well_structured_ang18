import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector,
    
  ) { }

  handleError(error: any): void {
    
    console.error('GlobalErrorHandlerService: An error occurred:', error);
    

    
    
    
  }
}
