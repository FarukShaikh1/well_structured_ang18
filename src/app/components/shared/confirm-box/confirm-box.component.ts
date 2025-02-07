import {
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-confirm-box',
  standalone: true,
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css'],
})
export class ConfirmBoxComponent implements AfterViewInit {
  @Output() confirmResult = new EventEmitter<boolean>();

  title: string = 'Confirmation';
  message: string = 'Are you sure you want to perform this action?';

  private modalInstance: any;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const modalElement =
      this.elementRef.nativeElement.querySelector('#confirmBox');
    if (modalElement) {
      this.modalInstance = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  openConfirmModal(title: string, message: string): void {
    this.title = title;
    this.message = message;
    this.modalInstance?.show();
  }

  closeConfirmPopup(result: boolean): void {
    this.modalInstance?.hide();
    this.confirmResult.emit(result);
  }
}
