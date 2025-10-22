import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoaderState {
  isLoading: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<LoaderState>({ isLoading: false });

  get isLoading$(): Observable<LoaderState> {
    return this.isLoadingSubject.asObservable();
  }

  showLoader(message: string = 'Loading...') {
    this.isLoadingSubject.next({ isLoading: true, message });
  }

  hideLoader() {
    this.isLoadingSubject.next({ isLoading: false });
  }
}
