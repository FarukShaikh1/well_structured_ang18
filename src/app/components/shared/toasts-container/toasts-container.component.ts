import { Component, inject, ViewEncapsulation } from '@angular/core';

import { ToastService } from './../../../services/toast/toast-service';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-toasts',
    standalone: true,
    imports: [NgbToastModule, NgTemplateOutlet,CommonModule],
    styleUrl:'./toasts-container.component.css',
    templateUrl: './toasts-container.component.html',
    encapsulation: ViewEncapsulation.None, // Override encapsulation
    host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainerComponent {
    toastService = inject(ToastService);

    pauseToast(toast: any) {
        toast.autohide = false; // Prevent the toast from auto-hiding when hovered
    }

    resumeToast(toast: any) {
        toast.autohide = true; // Resume auto-hide when mouse leaves
    }
}