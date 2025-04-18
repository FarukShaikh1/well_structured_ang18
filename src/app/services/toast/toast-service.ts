import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
	template: TemplateRef<any>;
	autohide: boolean; // Added autohide property
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: Toast[] = [];
	show(toast: Toast) {
		this.toasts.push({ ...toast, autohide: true });
	}
	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}
	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}