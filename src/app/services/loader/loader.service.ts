import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  showLoader() {
    this.isLoadingSubject.next(true);
  }

  hideLoader() {
    this.isLoadingSubject.next(false);
  }
}
