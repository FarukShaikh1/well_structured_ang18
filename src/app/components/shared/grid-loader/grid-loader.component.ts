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
  `,
  styles: [`
    .grid-loader-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      border-radius: 8px;
    }

    .grid-loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loader-text {
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }

    .spinner-border {
      width: 2rem;
      height: 2rem;
    }
  `]
})
export class GridLoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading data...';
}
