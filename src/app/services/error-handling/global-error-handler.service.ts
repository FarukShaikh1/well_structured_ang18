import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector,
    // private loaderService: LoaderService,
  ) { }

  handleError(error: any): void {
    // this.loaderService.hideLoader();
    console.error('GlobalErrorHandlerService: An error occurred:', error);
    // alert('GlobalErrorHandlerService: An error occurred: ' + error);

    // const router = this.injector.get(Router);
    // Navigate to a global error page or show a modal
    // router.navigate([Url_To_Navigate.UNAUTHORIZED_PAGE]);
  }
}
