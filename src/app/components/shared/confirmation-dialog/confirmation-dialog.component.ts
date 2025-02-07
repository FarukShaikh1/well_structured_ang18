import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  title: string = 'Confirmation';
  message: string = 'Are you sure?';
  cancelButtonLabel: string = 'Cancel';
  confirmButtonLabel: string = 'Confirm';

  @Output() outputAction = new EventEmitter<boolean>();
  modalInstance: any;
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit(): void {
    const modalElement =
      this.elementRef.nativeElement.querySelector('#confirmationPopup');
    if (modalElement) {
      this.modalInstance = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  openConfirmationPopup(title?: string, message?: string, cancelButtonLabel?: string, confirmButtonLabel?: string): void {
    const modal = document.getElementById('confirmationPopup');
    if (modal) {
      this.title = title || this.title;
      this.message = message || this.message;
      this.cancelButtonLabel = cancelButtonLabel || this.cancelButtonLabel;
      this.confirmButtonLabel = confirmButtonLabel || this.confirmButtonLabel;
      modal.style.display = 'block';
    }
  }

  closeConfirmationPopup(result: boolean) {
    const modal = document.getElementById('confirmationPopup');
    if (modal !== null) {
      modal.style.display = 'none';
    }
    this.outputAction.emit(result);
  }
}
