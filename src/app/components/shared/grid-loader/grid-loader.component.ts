import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-loader-overlay" *ngIf="isLoading">
      <div class="grid-loader-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="loader-text mt-2">{{ loadingText }}</div>
      </div>
    </div>
  `
})
export class GridLoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading data...';
}
