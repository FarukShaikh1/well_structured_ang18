import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService, LoaderState } from '../../../services/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css'],
    standalone: true,
    imports:[CommonModule]
})
export class LoaderComponent {
  loaderState$: Observable<LoaderState>;

  constructor(private loaderService: LoaderService) {
    this.loaderState$ = this.loaderService.isLoading$;
  }
}
