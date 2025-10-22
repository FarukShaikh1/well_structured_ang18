import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast/toast-service';
import { ToasterConfigs } from '../../../../utils/application-constants';
import { ToastsContainerComponent } from './../toasts-container/toasts-container.component';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  imports: [NgbTooltipModule, ToastsContainerComponent, CommonModule],
  styleUrls: ['./toaster.component.css'],
  standalone: true,
})
export class ToasterComponent {
  @ViewChild('toasterTemplate') toasterTemplate!: TemplateRef<any>;

  toastService = inject(ToastService);
  toastText: string = '';
  timeout = ToasterConfigs.TIMEOUT;
  showStandard(toastText: string) {
    if (this.toasterTemplate) {
      this.toastText = toastText;
      this.toastService.show({ template: this.toasterTemplate, autohide: true, });
    }
  }

  showMessage(toastText: string, result: string, timeout: number = this.timeout) {
    this.toastText = toastText;
    this.toastService.show({ template: this.toasterTemplate, autohide: true, classname: result === 'success' ? 'bg-success text-light' : 'bg-danger text-light', delay: timeout });
  }
}